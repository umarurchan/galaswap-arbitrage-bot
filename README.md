# GalaSwap Trading Bot

Advanced automated trading platform for GalaChain DEX with multiple algorithmic strategies and real wallet integration.

## Features

### Trading Strategies
- **Trend Following** - Momentum-based trading with market direction
- **Mean Reversion** - Counter-trend trading on price extremes
- **Breakout Trading** - Capitalize on price level breaks
- **Arbitrage** - Exploit price differences across markets
- **Grid Trading** - Systematic order placement strategy
- **Scalping** - High-frequency micro-profit trading

### Technical Capabilities
- Real-time market data integration
- Web3 wallet connectivity (MetaMask, Gala Wallet)
- Live opportunity scanning and detection
- Manual transaction signing workflow
- Performance tracking and analytics
- Professional trading interface

### GalaChain Integration
- Native GALA, SILK, MUSIC, FILM token support
- Real-time price feeds and volume data
- Multiple timeframe analysis (1M to 1D)
- Gas estimation and slippage protection

## Technology Stack

- **Frontend**: React 18, JavaScript ES6+
- **Styling**: Tailwind CSS, Custom CSS
- **Icons**: Lucide React
- **Web3**: Ethereum wallet integration
- **APIs**: GalaSwap DEX endpoints (simulated)

## Installation

1. Clone the repository:
```bash

## GalaChain + MetaMask

Configure environment variables by copying `.env.example` to `.env` and filling values:

```
REACT_APP_GALACHAIN_CHAIN_ID_HEX=0xXXXX
REACT_APP_GALACHAIN_CHAIN_NAME=GalaChain Mainnet
REACT_APP_GALACHAIN_RPC_URLS=https://gateway-mainnet.galachain.com/rpc
REACT_APP_GALACHAIN_BLOCK_EXPLORERS=https://explorer.galachain.com
REACT_APP_GALACHAIN_CURRENCY_NAME=Gala
REACT_APP_GALACHAIN_CURRENCY_SYMBOL=GALA
REACT_APP_GALACHAIN_CURRENCY_DECIMALS=18
REACT_APP_ENABLE_SEND=false
```

- Set `REACT_APP_ENABLE_SEND=true` to actually send transactions with MetaMask.
- When connecting, the app will try to switch/add the GalaChain to MetaMask.

## Private Key Storage (Optional)

Under Settings, you can encrypt and store a private key locally using a passphrase (PBKDF2 + AES-GCM). This never leaves your browser. Prefer MetaMask; only use this if you know what you are doing.