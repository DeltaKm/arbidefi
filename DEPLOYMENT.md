# Deployment Guide - DeFi Arbitrage Dashboard

## Deploy su Vercel

### 1. Preparazione

Assicurati che il progetto sia pronto per il deployment:

```bash
npm run build
```

### 2. Deploy su Vercel

#### Opzione A: Vercel CLI
```bash
# Installa Vercel CLI
npm i -g vercel

# Login su Vercel
vercel login

# Deploy
vercel
```

#### Opzione B: GitHub Integration
1. Pusha il codice su GitHub
2. Vai su [vercel.com](https://vercel.com)
3. Importa il repository GitHub
4. Configura le variabili d'ambiente

### 3. Variabili d'Ambiente Richieste

Nel dashboard di Vercel, aggiungi le seguenti variabili d'ambiente:

#### Variabili ESSENZIALI (Minime per funzionamento):
```
# RPC URLs per blockchain (sostituisci con i tuoi endpoint)
NEXT_PUBLIC_POLYGON_RPC_URL=https://polygon-mainnet.alchemyapi.io/v2/YOUR_API_KEY
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
ALCHEMY_API_KEY=your_alchemy_api_key_here
```

#### Variabili COMPLETE (Per funzionalità avanzate):
```
# Blockchain RPC URLs
NEXT_PUBLIC_ETHEREUM_RPC_URL=https://eth-mainnet.alchemyapi.io/v2/YOUR_API_KEY
NEXT_PUBLIC_POLYGON_RPC_URL=https://polygon-mainnet.alchemyapi.io/v2/YOUR_API_KEY
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_BSC_RPC_URL=https://bsc-dataseed.binance.org/

# API Keys
ALCHEMY_API_KEY=your_alchemy_api_key_here
INFURA_API_KEY=your_infura_api_key_here

# Contract Addresses (usa i default se non hai esigenze specifiche)
AAVE_V3_POOL_ADDRESS=0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2
DYDX_SOLO_MARGIN_ADDRESS=0x1E0447b19BB6EcFdAe1e4AE1694b0C3659614e4e

# DEX Router Addresses (usa i default)
UNISWAP_V2_ROUTER=0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
SUSHISWAP_ROUTER=0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F
PANCAKESWAP_ROUTER=0x10ED43C718714eb63d5aA57B78B54704E256024E

# Bot Configuration
MIN_PROFIT_THRESHOLD=0.5
MAX_GAS_PRICE=50
SLIPPAGE_TOLERANCE=0.01
MONITORING_INTERVAL=10000

# Security Flags
ENABLE_MAINNET=false
ENABLE_AUTO_EXECUTION=false
```

### 4. Configurazione Opzionale

Per configurazioni avanzate, modifica il file `vercel.json`:

- **Timeout delle funzioni**: Modificare `maxDuration` per API routes
- **Variabili d'ambiente**: Aggiungere nuove variabili nella sezione `env`
- **Rewrite/Redirect**: Aggiungere regole di routing personalizzate

### 5. Domini Personalizzati

1. Nel dashboard Vercel, vai su Settings > Domains
2. Aggiungi il tuo dominio personalizzato
3. Configura i DNS records come indicato

### 6. Monitoraggio

- **Analytics**: Abilitare Vercel Analytics per monitorare le performance
- **Logs**: Visualizzare i logs in tempo reale nel dashboard
- **Alerts**: Configurare notifiche per errori o downtime

### 7. Note di Sicurezza

⚠️ **IMPORTANTE**: 
- Non includere mai chiavi private o wallet seed phrases nelle variabili d'ambiente
- Usa sempre variabili `NEXT_PUBLIC_` per valori che devono essere accessibili nel browser
- Per operazioni sensibili, considera l'uso di API routes server-side

### 8. Troubleshooting

**Build Errors:**
- Verifica che tutte le dipendenze siano installate
- Controlla i lint errors con `npm run lint`
- Assicurati che il TypeScript compili senza errori

**Runtime Errors:**
- Controlla i logs di Vercel
- Verifica che le variabili d'ambiente siano configurate correttamente
- Testa localmente con `npm run build && npm start`

### 9. Performance

- Il dashboard è ottimizzato per il rendering statico
- Le chiamate API blockchain sono client-side per ridurre i costi server
- Considera l'implementazione di caching per le chiamate RPC frequenti
