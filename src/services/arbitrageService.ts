import { ethers } from 'ethers';
import { ArbitrageOpportunity, Token, DEX, ArbitrageConfig } from '@/types/arbitrage';

// Uniswap V2 Router ABI (simplified)
const UNISWAP_V2_ROUTER_ABI = [
  'function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)',
  'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)'
];

// Aave Flash Loan ABI (simplified)
const AAVE_FLASH_LOAN_ABI = [
  'function flashLoan(address receiverAddress, address[] calldata assets, uint256[] calldata amounts, uint256[] calldata modes, address onBehalfOf, bytes calldata params, uint16 referralCode) external'
];

export class ArbitrageService {
  private provider: ethers.JsonRpcProvider;
  private config: ArbitrageConfig;
  private isMonitoring = false;
  private opportunities: ArbitrageOpportunity[] = [];
  private errorCache = new Map<string, number>(); // Cache per ridurre spam di errori
  private stats = {
    totalOpportunities: 0,
    profitableOpportunities: 0,
    totalVolumeUSD: 0,
    averageProfit: 0
  };

  constructor(rpcUrl: string, config: ArbitrageConfig) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.config = config;
    console.log('ArbitrageService initialized with DEXs:', config.enabledDEXs.map((d: DEX) => d.name));
  }

  // Monitora le opportunità di arbitraggio
  async monitorArbitrageOpportunities(): Promise<ArbitrageOpportunity[]> {
    const opportunities: ArbitrageOpportunity[] = [];

    for (const tokenA of this.config.monitoredTokens) {
      for (const tokenB of this.config.monitoredTokens) {
        if (tokenA.address === tokenB.address) continue;

        // Controlla prezzi su diversi DEX
        for (let i = 0; i < this.config.enabledDEXs.length; i++) {
          for (let j = i + 1; j < this.config.enabledDEXs.length; j++) {
            const dexA = this.config.enabledDEXs[i];
            const dexB = this.config.enabledDEXs[j];

            try {
              const opportunity = await this.checkArbitrageOpportunity(
                tokenA,
                tokenB,
                dexA,
                dexB
              );

              if (opportunity && opportunity.profitability > this.config.minProfitThreshold) {
                opportunities.push(opportunity);
              }
            } catch (error) {
              console.error(`Error checking arbitrage between ${dexA.name} and ${dexB.name}:`, error);
            }
          }
        }
      }
    }

    this.opportunities = opportunities;
    return opportunities;
  }

  // Controlla una specifica opportunità di arbitraggio
  private async checkArbitrageOpportunity(
    tokenA: Token,
    tokenB: Token,
    dexA: DEX,
    dexB: DEX
  ): Promise<ArbitrageOpportunity | null> {
    const amountIn = ethers.parseUnits('1', tokenA.decimals); // 1 token come test

    try {
      // Ottieni prezzi da entrambi i DEX
      const priceA = await this.getPrice(tokenA, tokenB, dexA, amountIn);
      const priceB = await this.getPrice(tokenA, tokenB, dexB, amountIn);

      if (!priceA || !priceB) return null;

      const priceDifference = Math.abs(priceA - priceB);
      const profitability = (priceDifference / Math.min(priceA, priceB)) * 100;

      // Stima del gas
      const gasEstimate = await this.estimateGasCost();

      return {
        id: `${tokenA.symbol}-${tokenB.symbol}-${dexA.name}-${dexB.name}-${Date.now()}`,
        tokenA,
        tokenB,
        dexA,
        dexB,
        priceA,
        priceB,
        priceDifference,
        profitability,
        gasEstimate,
        timestamp: Date.now(),
        status: 'pending'
      };
    } catch (error) {
      console.error('Error checking arbitrage opportunity:', error);
      return null;
    }
  }

  // Ottieni il prezzo da un DEX specifico
  private async getPrice(
    tokenA: Token,
    tokenB: Token,
    dex: DEX,
    amountIn: bigint
  ): Promise<number | null> {
    try {
      const router = new ethers.Contract(dex.router, UNISWAP_V2_ROUTER_ABI, this.provider);
      const path = [tokenA.address, tokenB.address];
      
      // Verifica che il contratto esista
      const code = await this.provider.getCode(dex.router);
      if (code === '0x') {
        console.warn(`Router contract not found at ${dex.router} for ${dex.name}`);
        return null;
      }
      
      const amounts = await router.getAmountsOut(amountIn, path);
      const amountOut = amounts[1];
      
      return parseFloat(ethers.formatUnits(amountOut, tokenB.decimals));
    } catch (error: Error | unknown) {
      const errorKey = `${dex.name}-${tokenA.symbol}-${tokenB.symbol}`;
      const now = Date.now();
      const lastLogged = this.errorCache.get(errorKey) || 0;
      
      // Log solo ogni 30 secondi per lo stesso errore
      if (now - lastLogged > 30000) {
        // Type narrowing per gestire diversi tipi di errore
        if (typeof error === 'object' && error !== null) {
          const ethersError = error as { code?: string; message?: string };
          if (ethersError.code === 'CALL_EXCEPTION') {
            console.warn(`${dex.name}: No liquidity for ${tokenA.symbol}/${tokenB.symbol}`);
          } else {
            console.error(`Error getting price from ${dex.name}:`, ethersError.message || error);
          }
        } else {
          console.error(`Error getting price from ${dex.name}:`, error);
        }
        this.errorCache.set(errorKey, now);
      }
      return null;
    }
  }

  // Esegui arbitraggio con flash loan
  async executeArbitrage(opportunity: ArbitrageOpportunity, wallet: ethers.Wallet): Promise<boolean> {
    try {
      opportunity.status = 'executing';
      
      // Calcola l'importo ottimale per il flash loan
      const flashLoanAmount = await this.calculateOptimalAmount(opportunity);
      
      // Esegui il flash loan
      const success = await this.executeFlashLoan(opportunity, flashLoanAmount, wallet);
      
      opportunity.status = success ? 'completed' : 'failed';
      return success;
    } catch (error) {
      console.error('Error executing arbitrage:', error);
      opportunity.status = 'failed';
      return false;
    }
  }

  // Calcola l'importo ottimale per il flash loan
  private async calculateOptimalAmount(opportunity: ArbitrageOpportunity): Promise<bigint> {
    // Implementazione semplificata - in realtà dovrebbe calcolare l'importo ottimale
    // considerando slippage, fees, gas costs, etc.
    return ethers.parseUnits('1000', opportunity.tokenA.decimals);
  }

  // Esegui flash loan
  private async executeFlashLoan(
    opportunity: ArbitrageOpportunity,
    amount: bigint,
    wallet: ethers.Wallet
  ): Promise<boolean> {
    try {
      const flashLoanContract = new ethers.Contract(
        this.config.flashLoanProvider.address,
        AAVE_FLASH_LOAN_ABI,
        wallet
      );

      // Parametri per il flash loan
      const assets = [opportunity.tokenA.address];
      const amounts = [amount];
      const modes = [0]; // 0 = no debt
      const params = ethers.AbiCoder.defaultAbiCoder().encode(
        ['address', 'address', 'address', 'address'],
        [
          opportunity.dexA.router,
          opportunity.dexB.router,
          opportunity.tokenA.address,
          opportunity.tokenB.address
        ]
      );

      const tx = await flashLoanContract.flashLoan(
        wallet.address, // receiver
        assets,
        amounts,
        modes,
        wallet.address, // onBehalfOf
        params,
        0 // referralCode
      );

      await tx.wait();
      return true;
    } catch (error) {
      console.error('Flash loan execution failed:', error);
      return false;
    }
  }

  // Stima il costo del gas
  private async estimateGasCost(): Promise<number> {
    try {
      const gasPrice = await this.provider.getFeeData();
      const estimatedGas = 300000; // Stima approssimativa per un'operazione di arbitraggio
      
      if (gasPrice.gasPrice) {
        return parseFloat(ethers.formatEther(gasPrice.gasPrice * BigInt(estimatedGas)));
      }
      return 0.01; // Fallback
    } catch (error) {
      console.error('Error estimating gas cost:', error);
      return 0.01;
    }
  }

  // Ottieni le opportunità correnti
  getOpportunities(): ArbitrageOpportunity[] {
    return this.opportunities;
  }

  // Aggiorna la configurazione
  updateConfig(newConfig: Partial<ArbitrageConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}
