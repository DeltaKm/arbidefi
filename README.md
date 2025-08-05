# DeFi Arbitrage Bot 🚀

Un bot di arbitraggio DeFi avanzato costruito con Next.js, TypeScript e shadcn/ui che monitora le opportunità di arbitraggio tra diversi DEX e utilizza flash loan per massimizzare i profitti.

## ✨ Caratteristiche

- 🔍 **Monitoraggio in tempo reale** delle opportunità di arbitraggio
- ⚡ **Flash Loan Integration** con Aave V3 e dYdX
- 🔄 **Multi-DEX Support** (Uniswap V2, SushiSwap, PancakeSwap)
- 🌐 **Multi-Chain** (Ethereum, Polygon, BSC)
- 📊 **Dashboard interattiva** con statistiche in tempo reale
- ⚙️ **Configurazione avanzata** per parametri di trading
- 🛡️ **Sicurezza integrata** con validazione delle transazioni

## 🛠️ Tecnologie Utilizzate

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **Blockchain**: ethers.js v6
- **DeFi Protocols**: Uniswap SDK, Aave, dYdX

## 📋 Prerequisiti

- Node.js 18+ 
- npm o yarn
- Account Alchemy (per RPC endpoints)
- Wallet di test con fondi (per testing)

## 🚀 Installazione

1. **Clona il repository**
```bash
git clone <repository-url>
cd windsurf-project
```

2. **Installa le dipendenze**
```bash
npm install
```

3. **Configura le variabili d'ambiente**
Crea un file `.env.local` nella root del progetto:

```bash
# RPC URLs
NEXT_PUBLIC_ETHEREUM_RPC_URL=https://eth-mainnet.alchemyapi.io/v2/YOUR_ALCHEMY_API_KEY
NEXT_PUBLIC_POLYGON_RPC_URL=https://polygon-mainnet.alchemyapi.io/v2/YOUR_ALCHEMY_API_KEY
NEXT_PUBLIC_BSC_RPC_URL=https://bsc-dataseed.binance.org/

# API Keys
ALCHEMY_API_KEY=your_alchemy_api_key_here

# Wallet Configuration (SOLO PER TESTING)
PRIVATE_KEY=your_test_wallet_private_key_here
WALLET_ADDRESS=your_wallet_address_here

# Bot Configuration
MIN_PROFIT_THRESHOLD=0.5
MAX_GAS_PRICE=50
SLIPPAGE_TOLERANCE=0.01
MONITORING_INTERVAL=10000

# Security Flags
ENABLE_MAINNET=false
ENABLE_AUTO_EXECUTION=false
```

4. **Avvia il server di sviluppo**
```bash
npm run dev
```

5. **Apri il browser**
Vai su [http://localhost:3000](http://localhost:3000)

## 🎯 Come Funziona

### 1. Monitoraggio delle Opportunità
Il bot scansiona continuamente i prezzi dei token su diversi DEX per identificare discrepanze di prezzo che possono essere sfruttate per l'arbitraggio.

### 2. Calcolo della Profittabilità
Per ogni opportunità identificata, il bot calcola:
- Differenza di prezzo tra i DEX
- Profittabilità potenziale
- Costi del gas stimati
- Commissioni dei flash loan

### 3. Esecuzione dell'Arbitraggio
Quando viene identificata un'opportunità profittevole:
1. Richiede un flash loan per il capitale necessario
2. Acquista il token sul DEX con prezzo più basso
3. Vende il token sul DEX con prezzo più alto
4. Restituisce il flash loan + commissioni
5. Mantiene il profitto

## 📊 Dashboard

La dashboard fornisce:

- **Statistiche in tempo reale**: Opportunità totali, profittevoli, profitto medio
- **Configurazione**: Soglia di profitto minima, prezzo gas massimo, tolleranza slippage
- **Tabella opportunità**: Lista dettagliata con possibilità di esecuzione manuale
- **Selezione rete**: Switch tra Ethereum, Polygon e BSC

## ⚙️ Configurazione Avanzata

### Parametri del Bot

- **MIN_PROFIT_THRESHOLD**: Profitto minimo richiesto (default: 0.5%)
- **MAX_GAS_PRICE**: Prezzo gas massimo in gwei (default: 50)
- **SLIPPAGE_TOLERANCE**: Tolleranza slippage (default: 1%)
- **MONITORING_INTERVAL**: Intervallo di monitoraggio in ms (default: 10000)

### Sicurezza

- **ENABLE_MAINNET**: Abilita trading su mainnet (default: false)
- **ENABLE_AUTO_EXECUTION**: Abilita esecuzione automatica (default: false)

## 🔧 Sviluppo

### Struttura del Progetto

```
src/
├── components/          # Componenti React
│   ├── ui/             # Componenti shadcn/ui
│   └── ArbitrageDashboard.tsx
├── services/           # Logica business
│   └── arbitrageService.ts
├── types/              # Definizioni TypeScript
│   └── arbitrage.ts
├── config/             # Configurazioni
│   ├── defaultConfig.ts
│   └── env.ts
└── app/                # Pages Next.js
    └── page.tsx
```

### Comandi Disponibili

```bash
npm run dev          # Avvia server di sviluppo
npm run build        # Build per produzione
npm run start        # Avvia server di produzione
npm run lint         # Linting del codice
```

## ⚠️ Avvertenze Importanti

1. **TESTNET FIRST**: Testa sempre su testnet prima di usare fondi reali
2. **PRIVATE KEYS**: Non condividere mai le tue chiavi private
3. **GAS COSTS**: Considera sempre i costi del gas nei calcoli di profittabilità
4. **SLIPPAGE**: I mercati DeFi sono volatili, usa sempre tolleranze appropriate
5. **REGULATORY**: Verifica la conformità normativa nella tua giurisdizione

## 🤝 Contribuire

1. Fork del progetto
2. Crea un branch per la tua feature (`git checkout -b feature/AmazingFeature`)
3. Commit delle modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 📄 Licenza

Questo progetto è rilasciato sotto licenza MIT. Vedi il file `LICENSE` per i dettagli.

## 🆘 Supporto

Per supporto e domande:
- Apri un issue su GitHub
- Consulta la documentazione dei protocolli DeFi utilizzati
- Verifica le configurazioni di rete e API keys

---

**Disclaimer**: Questo software è fornito "as is" senza garanzie. L'uso di questo bot comporta rischi finanziari. Usa sempre fondi che puoi permetterti di perdere e testa accuratamente prima dell'uso in produzione.
