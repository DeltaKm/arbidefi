// Configurazione delle variabili d'ambiente
export const ENV = {
  // RPC URLs
  ETHEREUM_RPC_URL: process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL || 'https://eth-mainnet.alchemyapi.io/v2/demo',
  POLYGON_RPC_URL: process.env.NEXT_PUBLIC_POLYGON_RPC_URL || 'https://polygon-mainnet.alchemyapi.io/v2/demo',
  BSC_RPC_URL: process.env.NEXT_PUBLIC_BSC_RPC_URL || 'https://bsc-dataseed.binance.org/',

  // API Keys
  ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY || '',
  INFURA_API_KEY: process.env.INFURA_API_KEY || '',

  // Wallet (solo per testing)
  PRIVATE_KEY: process.env.PRIVATE_KEY || '',
  WALLET_ADDRESS: process.env.WALLET_ADDRESS || '',

  // Contract Addresses
  AAVE_V3_POOL_ADDRESS: process.env.AAVE_V3_POOL_ADDRESS || '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2',
  DYDX_SOLO_MARGIN_ADDRESS: process.env.DYDX_SOLO_MARGIN_ADDRESS || '0x1E0447b19BB6EcFdAe1e4AE1694b0C3659614e4e',

  // DEX Routers
  UNISWAP_V2_ROUTER: process.env.UNISWAP_V2_ROUTER || '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  SUSHISWAP_ROUTER: process.env.SUSHISWAP_ROUTER || '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F',
  PANCAKESWAP_ROUTER: process.env.PANCAKESWAP_ROUTER || '0x10ED43C718714eb63d5aA57B78B54704E256024E',

  // Bot Configuration
  MIN_PROFIT_THRESHOLD: parseFloat(process.env.MIN_PROFIT_THRESHOLD || '0.5'),
  MAX_GAS_PRICE: parseInt(process.env.MAX_GAS_PRICE || '50'),
  SLIPPAGE_TOLERANCE: parseFloat(process.env.SLIPPAGE_TOLERANCE || '0.01'),
  MONITORING_INTERVAL: parseInt(process.env.MONITORING_INTERVAL || '10000'),

  // Security Flags
  ENABLE_MAINNET: process.env.ENABLE_MAINNET === 'true',
  ENABLE_AUTO_EXECUTION: process.env.ENABLE_AUTO_EXECUTION === 'true',
};

// Validazione delle variabili critiche
export function validateEnvironment(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (ENV.ENABLE_MAINNET && !ENV.ALCHEMY_API_KEY) {
    errors.push('ALCHEMY_API_KEY è richiesto quando ENABLE_MAINNET è true');
  }

  if (ENV.ENABLE_AUTO_EXECUTION && !ENV.PRIVATE_KEY) {
    errors.push('PRIVATE_KEY è richiesto quando ENABLE_AUTO_EXECUTION è true');
  }

  if (ENV.ENABLE_MAINNET && ENV.PRIVATE_KEY && ENV.PRIVATE_KEY.length < 60) {
    errors.push('PRIVATE_KEY sembra non essere valida (troppo corta)');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Network configurations usando le variabili d'ambiente
export const NETWORK_CONFIGS_ENV = {
  ethereum: {
    rpcUrl: ENV.ETHEREUM_RPC_URL,
    chainId: 1,
    name: 'Ethereum Mainnet',
    enabled: ENV.ENABLE_MAINNET,
    nativeCurrency: 'ETH',
    gasMultiplier: 1.5,
    minProfitThreshold: 0.5 // Gas alti richiedono più profitto
  },
  polygon: {
    rpcUrl: ENV.POLYGON_RPC_URL,
    chainId: 137,
    name: 'Polygon',
    enabled: true, // Sempre abilitato per testing
    nativeCurrency: 'MATIC',
    gasMultiplier: 1.1,
    minProfitThreshold: 0.2 // Gas bassi = profitto minimo più basso
  },
  base: {
    rpcUrl: process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org',
    chainId: 8453,
    name: 'Base',
    enabled: true, // Sempre abilitato per testing
    nativeCurrency: 'ETH',
    gasMultiplier: 1.2,
    minProfitThreshold: 0.3 // Gas moderati
  }
};
