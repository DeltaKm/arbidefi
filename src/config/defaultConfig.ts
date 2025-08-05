import { ArbitrageConfig, DEX, Token, FlashLoanProvider } from '@/types/arbitrage';

// Token per diverse reti
export const POLYGON_TOKENS: Token[] = [
  {
    address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', // WMATIC
    symbol: 'WMATIC',
    decimals: 18,
    name: 'Wrapped Matic'
  },
  {
    address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // USDC
    symbol: 'USDC',
    decimals: 6,
    name: 'USD Coin'
  },
  {
    address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', // USDT
    symbol: 'USDT',
    decimals: 6,
    name: 'Tether USD'
  },
  {
    address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', // DAI
    symbol: 'DAI',
    decimals: 18,
    name: 'Dai Stablecoin'
  },
  {
    address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', // WETH
    symbol: 'WETH',
    decimals: 18,
    name: 'Wrapped Ether'
  }
];

// Token per Base (solo i più liquidi)
export const BASE_TOKENS: Token[] = [
  {
    symbol: 'WETH',
    address: '0x4200000000000000000000000000000000000006',
    decimals: 18,
    name: 'Wrapped Ether'
  },
  {
    symbol: 'USDC',
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    decimals: 6,
    name: 'USD Coin'
  },
  {
    symbol: 'USDbC',
    address: '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA',
    decimals: 6,
    name: 'USD Base Coin'
  }
];

export const ETHEREUM_TOKENS: Token[] = [
  {
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    symbol: 'WETH',
    decimals: 18,
    name: 'Wrapped Ether'
  },
  {
    address: '0xA0b86a33E6441c8C06DD2b7c94b7E0e8c07e8e8e',
    symbol: 'USDC',
    decimals: 6,
    name: 'USD Coin'
  },
  {
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    symbol: 'USDT',
    decimals: 6,
    name: 'Tether USD'
  },
  {
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    symbol: 'DAI',
    decimals: 18,
    name: 'Dai Stablecoin'
  }
];

// DEX per Polygon (solo V2 compatibili per ora)
export const POLYGON_DEXS: DEX[] = [
  {
    name: 'QuickSwap',
    router: '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff',
    factory: '0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32',
    fee: 0.003 // 0.3%
  },
  {
    name: 'SushiSwap Polygon',
    router: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
    factory: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
    fee: 0.003 // 0.3%
  }
];

// DEX per Base (solo Uniswap V2 per ora - altri DEX hanno interfacce diverse)
export const BASE_DEXS: DEX[] = [
  {
    name: 'BaseSwap',
    router: '0x327Df1E6de05895d2ab08513aaDD9313Fe505d86',
    factory: '0xFDa619b6d20975be80A10332cD39b9a4b0FAa8BB',
    fee: 0.0025 // 0.25%
  }
];

// DEX per Ethereum (mantenuti per compatibilità)
export const ETHEREUM_DEXS: DEX[] = [
  {
    name: 'Uniswap V2',
    router: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    factory: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
    fee: 0.003 // 0.3%
  },
  {
    name: 'SushiSwap',
    router: '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F',
    factory: '0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac',
    fee: 0.003 // 0.3%
  }
];

// Provider di Flash Loan per diverse reti
export const POLYGON_FLASH_LOAN_PROVIDERS: FlashLoanProvider[] = [
  {
    name: 'Aave V3 Polygon',
    address: '0x794a61358D6845594F94dc1DB02A252b5b4814aD',
    fee: 0.0009, // 0.09%
    maxAmount: '1000000000000000000000000' // 1M tokens
  }
];

export const BASE_FLASH_LOAN_PROVIDERS: FlashLoanProvider[] = [
  {
    name: 'Aave V3 Base',
    address: '0xA238Dd80C259a72e81d7e4664a9801593F98d1c5',
    fee: 0.0009, // 0.09%
    maxAmount: '1000000000000000000000000' // 1M tokens
  }
];

export const ETHEREUM_FLASH_LOAN_PROVIDERS: FlashLoanProvider[] = [
  {
    name: 'Aave V3',
    address: '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2',
    fee: 0.0009, // 0.09%
    maxAmount: '1000000000000000000000000' // 1M tokens
  },
  {
    name: 'dYdX',
    address: '0x1E0447b19BB6EcFdAe1e4AE1694b0C3659614e4e',
    fee: 0,
    maxAmount: '500000000000000000000000' // 500K tokens
  }
];

// Funzione per ottenere la configurazione per rete
export function getNetworkConfig(network: 'polygon' | 'base'): ArbitrageConfig {
  const configs = {
    polygon: {
      minProfitThreshold: 0.2, // Gas più bassi, profitto minimo più basso
      maxGasPrice: 100, // In GWEI ma su Polygon è molto più economico
      slippageTolerance: 0.01,
      flashLoanProvider: POLYGON_FLASH_LOAN_PROVIDERS[0],
      enabledDEXs: POLYGON_DEXS,
      monitoredTokens: POLYGON_TOKENS
    },
    base: {
      minProfitThreshold: 0.3, // Gas bassi ma non quanto Polygon
      maxGasPrice: 20,
      slippageTolerance: 0.01,
      flashLoanProvider: BASE_FLASH_LOAN_PROVIDERS[0],
      enabledDEXs: BASE_DEXS,
      monitoredTokens: BASE_TOKENS
    }
  };
  
  return configs[network];
}

// Configurazione predefinita (Polygon per costi bassi)
export const DEFAULT_CONFIG: ArbitrageConfig = getNetworkConfig('polygon');

// Configurazioni RPC per diverse reti
export const NETWORK_CONFIGS = {
  ethereum: {
    rpcUrl: 'https://eth-mainnet.alchemyapi.io/v2/YOUR_API_KEY',
    chainId: 1,
    name: 'Ethereum Mainnet',
    nativeCurrency: 'ETH',
    gasMultiplier: 1.5 // Gas più alto
  },
  polygon: {
    rpcUrl: 'https://polygon-mainnet.alchemyapi.io/v2/YOUR_API_KEY',
    chainId: 137,
    name: 'Polygon',
    nativeCurrency: 'MATIC',
    gasMultiplier: 1.1 // Gas molto basso
  },
  base: {
    rpcUrl: 'https://mainnet.base.org',
    chainId: 8453,
    name: 'Base',
    nativeCurrency: 'ETH',
    gasMultiplier: 1.2 // Gas basso
  }
};
