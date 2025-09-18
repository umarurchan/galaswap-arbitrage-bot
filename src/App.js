import React, { useState, useEffect } from 'react';
import { Play, Pause, Activity, Settings, RefreshCw, CheckCircle, Target, Zap, BarChart3, TrendingUp, ArrowUpRight, ArrowDownRight, LineChart, PieChart, DollarSign, Clock, Users, Volume2 } from 'lucide-react';

const GalaSwapTradingBot = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletBalance, setWalletBalance] = useState({
    GALA: '49.92998557',
    FILM: '4.30574483',
    SILK: '0.00',
    MUSIC: '0.00',
    GUSDT: '0.00',
    GUSDC: '0.00',
    GSWAP: '0.00'
  });
  const [botActive, setBotActive] = useState(false);
  const [activeStrategy, setActiveStrategy] = useState('trend-following');
  const [currentScan, setCurrentScan] = useState(0);
  const [opportunities, setOpportunities] = useState([]);
  const [trades, setTrades] = useState([]);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({
    totalTrades: 156,
    successfulTrades: 134,
    totalProfit: 847.32,
    dailyProfit: 124.56,
    successRate: 86,
    totalVolume: 15420.50,
    avgTradeSize: 98.85,
    largestWin: 245.60
  });
  const [marketData, setMarketData] = useState({
    GALA: { price: 0.0234, change: 5.67, volume: 2345000 },
    SILK: { price: 0.0156, change: -2.34, volume: 890000 },
    MUSIC: { price: 0.0089, change: 12.45, volume: 1560000 },
    FILM: { price: 0.0078, change: 3.21, volume: 678000 }
  });
  const [scanProgress, setScanProgress] = useState(0);
  const [detectedWallets, setDetectedWallets] = useState([]);
  const [isConnecting, setIsConnecting] = useState(null);
  const [tradingPairs, setTradingPairs] = useState([
    'GALA/GUSDC', 'SILK/GALA', 'MUSIC/GALA', 'FILM/GALA', 
    'GALA/GUSDT', 'GSWAP/GALA', 'ETIME/GALA', 'GTON/GALA'
  ]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1H');
  const [pendingSignature, setPendingSignature] = useState(null);
  const [showSignModal, setShowSignModal] = useState(false);

  const tradingStrategies = {
    'trend-following': {
      name: 'Trend Following',
      description: 'Follows market momentum and trends',
      icon: TrendingUp,
      color: 'blue',
      riskLevel: 'Medium'
    },
    'mean-reversion': {
      name: 'Mean Reversion',
      description: 'Trades against price extremes',
      icon: BarChart3,
      color: 'green',
      riskLevel: 'Low'
    },
    'breakout': {
      name: 'Breakout Trading',
      description: 'Captures momentum after price breaks',
      icon: Zap,
      color: 'yellow',
      riskLevel: 'High'
    },
    'arbitrage': {
      name: 'Arbitrage',
      description: 'Exploits price differences',
      icon: Target,
      color: 'purple',
      riskLevel: 'Low'
    },
    'grid': {
      name: 'Grid Trading',
      description: 'Places orders in grid pattern',
      icon: PieChart,
      color: 'indigo',
      riskLevel: 'Medium'
    },
    'scalping': {
      name: 'Scalping',
      description: 'High frequency micro trades',
      icon: Volume2,
      color: 'red',
      riskLevel: 'High'
    }
  };

  const addLog = (type, message, data = {}) => {
    const newLog = {
      id: Date.now(),
      timestamp: new Date(),
      type,
      message,
      data
    };
    setLogs(prev => [newLog, ...prev.slice(0, 99)]);
  };

  const getTokenIcon = (token) => {
    const icons = {
      'GALA': '🎮', 'SILK': '🕷️', 'MUSIC': '🎵', 'FILM': '🎬',
      'GUSDT': '💵', 'GUSDC': '🪙', 'GSWAP': '🔄', 'ETIME': '⏰', 'GTON': '🌐'
    };
    return icons[token] || '🪙';
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  const generateOpportunity = () => {
    const strategies = Object.keys(tradingStrategies);
    const strategy = strategies[Math.floor(Math.random() * strategies.length)];
    const pair = tradingPairs[Math.floor(Math.random() * tradingPairs.length)];
    const signal = Math.random() > 0.5 ? 'BUY' : 'SELL';
    
    let opportunityType = '';
    let confidence = 0;
    let expectedProfit = 0;
    
    switch(strategy) {
      case 'trend-following':
        opportunityType = `${signal} - Strong Trend Detected`;
        confidence = 75 + Math.random() * 20;
        expectedProfit = 15 + Math.random() * 25;
        break;
      case 'mean-reversion':
        opportunityType = `${signal} - Oversold/Overbought`;
        confidence = 70 + Math.random() * 25;
        expectedProfit = 8 + Math.random() * 15;
        break;
      case 'breakout':
        opportunityType = `${signal} - Breakout Signal`;
        confidence = 65 + Math.random() * 30;
        expectedProfit = 20 + Math.random() * 40;
        break;
      case 'arbitrage':
        opportunityType = 'Price Arbitrage';
        confidence = 85 + Math.random() * 10;
        expectedProfit = 5 + Math.random() * 10;
        break;
      case 'grid':
        opportunityType = `${signal} - Grid Level Hit`;
        confidence = 80 + Math.random() * 15;
        expectedProfit = 10 + Math.random() * 20;
        break;
      case 'scalping':
        opportunityType = `${signal} - Quick Scalp`;
        confidence = 60 + Math.random() * 25;
        expectedProfit = 3 + Math.random() * 8;
        break;
    }

    return {
      id: Date.now(),
      strategy,
      strategyName: tradingStrategies[strategy].name,
      type: opportunityType,
      pair,
      signal,
      price: 0.0234 + (Math.random() - 0.5) * 0.01,
      targetPrice: 0.0234 + (Math.random() - 0.5) * 0.02,
      confidence,
      expectedProfit,
      timeframe: selectedTimeframe,
      volume: 1000 + Math.random() * 5000,
      timeFound: new Date(),
      status: 'active'
    };
  };

  const executeDemo = (opportunity) => {
    // Set up the transaction for signing
    const transaction = {
      opportunity,
      transactionData: {
        to: '0x1234567890123456789012345678901234567890', // Mock GalaSwap router
        value: '0x0',
        gasLimit: '0x5208',
        gasPrice: '0x9184e72a000',
        data: `0x${Math.random().toString(16).substr(2, 64)}`, // Mock transaction data
      },
      estimatedGas: 0.05 + Math.random() * 0.1,
      slippagePercent: 1.0 + Math.random() * 2,
    };

    setPendingSignature(transaction);
    setShowSignModal(true);
    addLog('info', `Preparing ${opportunity.strategyName} trade for signature...`);
  };

  const handleSignTransaction = async () => {
    if (!pendingSignature) return;

    const { opportunity, transactionData } = pendingSignature;
    
    addLog('execution', `Requesting signature for ${opportunity.pair} trade...`);
    
    setOpportunities(prev => 
      prev.map(op => 
        op.id === opportunity.id 
          ? { ...op, status: 'signing' }
          : op
      )
    );

    try {
      // Simulate wallet signing process
      addLog('wallet', 'Opening wallet for transaction signature...');
      
      // In real implementation, this would be:
      // const signature = await wallet.provider.request({
      //   method: 'eth_signTransaction',
      //   params: [transactionData]
      // });

      // Simulate signature delay
      setTimeout(async () => {
        try {
          // Mock signature success
          const mockSignature = `0x${Math.random().toString(16).substr(2, 130)}`;
          addLog('success', `Transaction signed: ${mockSignature.slice(0, 10)}...`);
          
          setOpportunities(prev => 
            prev.map(op => 
              op.id === opportunity.id 
                ? { ...op, status: 'executing' }
                : op
            )
          );

          // Simulate transaction execution
          setTimeout(() => {
            const success = Math.random() > 0.15; // 85% success rate
            
            if (success) {
              const actualProfit = opportunity.expectedProfit * (0.7 + Math.random() * 0.6);
              
              const completedTrade = {
                id: Date.now(),
                ...opportunity,
                status: 'completed',
                timestamp: new Date(),
                actualProfit,
                pnl: opportunity.signal === 'BUY' ? actualProfit : -actualProfit * 0.3,
                executionPrice: opportunity.price + (Math.random() - 0.5) * 0.001,
                transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
                signature: mockSignature,
                gasUsed: pendingSignature.estimatedGas
              };
              
              setTrades(prev => [completedTrade, ...prev.slice(0, 24)]);
              
              setStats(prev => ({
                ...prev,
                totalTrades: prev.totalTrades + 1,
                successfulTrades: prev.successfulTrades + 1,
                totalProfit: prev.totalProfit + actualProfit,
                dailyProfit: prev.dailyProfit + actualProfit,
                totalVolume: prev.totalVolume + opportunity.volume,
                successRate: Math.round(((prev.successfulTrades + 1) / (prev.totalTrades + 1)) * 100),
                largestWin: Math.max(prev.largestWin, actualProfit)
              }));

              addLog('success', `Trade executed: +${actualProfit.toFixed(2)} profit`);
              addLog('technical', `TX Hash: ${completedTrade.transactionHash.slice(0, 10)}... | Gas: ${pendingSignature.estimatedGas.toFixed(4)} GALA`);
            } else {
              const loss = opportunity.expectedProfit * 0.3;
              addLog('error', `Trade failed: Market conditions changed | -${loss.toFixed(2)}`);
              
              setStats(prev => ({
                ...prev,
                totalTrades: prev.totalTrades + 1,
                totalProfit: prev.totalProfit - loss,
                successRate: Math.round((prev.successfulTrades / (prev.totalTrades + 1)) * 100)
              }));
            }

            setTimeout(() => {
              setOpportunities(prev => prev.filter(op => op.id !== opportunity.id));
            }, 2000);
          }, 3000);

        } catch (error) {
          addLog('error', `Signature failed: ${error.message}`);
          setOpportunities(prev => 
            prev.map(op => 
              op.id === opportunity.id 
                ? { ...op, status: 'active' }
                : op
            )
          );
        }
      }, 2000);

    } catch (error) {
      addLog('error', `Transaction preparation failed: ${error.message}`);
    }

    setShowSignModal(false);
    setPendingSignature(null);
  };

  const handleRejectTransaction = () => {
    if (pendingSignature) {
      addLog('info', 'Transaction rejected by user');
      setOpportunities(prev => 
        prev.map(op => 
          op.id === pendingSignature.opportunity.id 
            ? { ...op, status: 'active' }
            : op
        )
      );
    }
    setShowSignModal(false);
    setPendingSignature(null);
  };

  const scanForOpportunities = () => {
    if (!botActive || !walletConnected) return;

    const opportunity = generateOpportunity();
    
    // Only show opportunities that match selected strategy or high confidence ones
    if (opportunity.strategy === activeStrategy || opportunity.confidence > 85) {
      setOpportunities(prev => [opportunity, ...prev.slice(0, 5)]);
      
      addLog('scan', `${opportunity.strategyName} opportunity found on ${opportunity.pair}`);
      addLog('info', `Signal: ${opportunity.signal} at $${opportunity.price.toFixed(4)} | Confidence: ${opportunity.confidence.toFixed(1)}%`);
      
      // Auto-execute high confidence trades
      if (opportunity.confidence > 90) {
        setTimeout(() => executeDemo(opportunity), 3000 + Math.random() * 2000);
      }
    }
  };

  const connectWallet = async (walletName) => {
    const wallet = detectedWallets.find(w => w.name === walletName);
    
    if (!wallet?.detected) {
      if (wallet?.installUrl) {
        window.open(wallet.installUrl, '_blank');
      }
      return;
    }

    setIsConnecting(walletName);
    addLog('wallet', `Connecting to ${walletName}...`);
    
    try {
      const accounts = await wallet.provider.request({
        method: 'eth_requestAccounts'
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts returned from wallet');
      }

      const address = accounts[0];
      setWalletAddress(address);
      setWalletConnected(true);

      addLog('success', `${walletName} connected: ${address}`);
      addLog('info', 'Portfolio loaded: 49.93 GALA, 4.31 FILM');

    } catch (error) {
      let errorMessage = 'Failed to connect wallet';
      if (error.code === 4001) errorMessage = 'Connection rejected by user';
      addLog('error', `Connection failed: ${errorMessage}`);
    } finally {
      setIsConnecting(null);
    }
  };

  const disconnectWallet = () => {
    setWalletConnected(false);
    setWalletAddress('');
    setBotActive(false);
    addLog('wallet', 'Wallet disconnected');
  };

  const toggleBot = () => {
    if (!walletConnected) {
      addLog('error', 'Please connect your wallet first');
      return;
    }
    
    const newState = !botActive;
    setBotActive(newState);
    
    if (newState) {
      setScanProgress(0);
      const strategy = tradingStrategies[activeStrategy];
      addLog('info', `Trading bot activated with ${strategy.name} strategy`);
      addLog('technical', `Risk Level: ${strategy.riskLevel} | Timeframe: ${selectedTimeframe}`);
    } else {
      addLog('info', 'Trading bot deactivated');
    }
  };

  // Wallet detection
  useEffect(() => {
    const detectWallets = () => {
      const wallets = [];
      
      if (typeof window !== 'undefined') {
        if (window.ethereum?.isMetaMask) {
          wallets.push({
            name: 'MetaMask',
            icon: '🦊',
            detected: true,
            provider: window.ethereum
          });
        }
        
        let galaWalletProvider = null;
        if (window.gala || window.ethereum?.isGala || window.galaWallet) {
          galaWalletProvider = window.gala || window.ethereum || window.galaWallet;
          wallets.push({
            name: 'Gala Wallet',
            icon: '🎮',
            detected: true,
            provider: galaWalletProvider
          });
        }
      }
      
      const popularWallets = [
        { name: 'MetaMask', icon: '🦊', installUrl: 'https://metamask.io/download/' },
        { name: 'Gala Wallet', icon: '🎮', installUrl: 'https://chromewebstore.google.com/detail/gala-wallet/enogcihmejeobfbnkkbcgcjffgdieaoj' }
      ];
      
      popularWallets.forEach(wallet => {
        if (!wallets.find(w => w.name === wallet.name)) {
          wallets.push({
            ...wallet,
            detected: false,
            provider: null
          });
        }
      });
      
      setDetectedWallets(wallets);
    };

    detectWallets();
    const interval = setInterval(detectWallets, 2000);
    return () => clearInterval(interval);
  }, []);

  // Update market data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(prev => {
        const updated = {};
        Object.keys(prev).forEach(token => {
          const change = (Math.random() - 0.5) * 2;
          updated[token] = {
            ...prev[token],
            price: Math.max(0.001, prev[token].price * (1 + change / 100)),
            change: prev[token].change + change,
            volume: prev[token].volume * (0.9 + Math.random() * 0.2)
          };
        });
        return updated;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Bot scanning activity
  useEffect(() => {
    let scanInterval;
    let progressInterval;
    
    if (botActive && walletConnected) {
      scanInterval = setInterval(() => {
        const currentPair = tradingPairs[currentScan];
        setCurrentScan(prev => (prev + 1) % tradingPairs.length);
        
        addLog('scan', `Scanning ${currentPair} for ${tradingStrategies[activeStrategy].name} signals...`);
        scanForOpportunities();
        
      }, 3000);

      progressInterval = setInterval(() => {
        setScanProgress(prev => prev >= 100 ? 0 : prev + 1.5);
      }, 45);
    }

    return () => {
      clearInterval(scanInterval);
      clearInterval(progressInterval);
    };
  }, [botActive, walletConnected, currentScan, activeStrategy]);

  const getLogIcon = (type) => {
    const icons = {
      info: '💡', success: '✅', error: '❌', trade: '💰',
      scan: '🔍', wallet: '👛', execution: '⚡', technical: '⚙️'
    };
    return icons[type] || 'ℹ️';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="text-2xl">🔥</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">GalaSwap Trading Bot</h1>
              <p className="text-gray-600 text-sm">Advanced automated trading strategies for GalaChain</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {!walletConnected ? (
              <div className="flex gap-2">
                {detectedWallets.slice(0, 2).map((wallet, index) => (
                  <button
                    key={index}
                    onClick={() => connectWallet(wallet.name)}
                    disabled={isConnecting === wallet.name}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      wallet.detected 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {wallet.icon} {wallet.name}
                  </button>
                ))}
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-2 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </span>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-sm"
                >
                  Disconnect
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-12 gap-6">
          
          {/* Left Panel - Strategy & Controls */}
          <div className="col-span-3 space-y-6">
            
            {/* Strategy Selection */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Trading Strategy</h3>
              <div className="space-y-2">
                {Object.entries(tradingStrategies).map(([key, strategy]) => {
                  const IconComponent = strategy.icon;
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveStrategy(key)}
                      className={`w-full p-3 rounded-lg text-left transition-all ${
                        activeStrategy === key 
                          ? `bg-${strategy.color}-50 border-${strategy.color}-200 border-2` 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <IconComponent className={`w-4 h-4 text-${strategy.color}-600`} />
                        <span className="font-medium text-sm">{strategy.name}</span>
                      </div>
                      <div className="text-xs text-gray-600">{strategy.description}</div>
                      <div className="text-xs text-gray-500 mt-1">Risk: {strategy.riskLevel}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bot Controls */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Bot Status</h3>
                <div className={`flex items-center gap-2 ${botActive ? 'text-green-600' : 'text-gray-500'}`}>
                  <div className={`w-2 h-2 rounded-full ${botActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                  <span className="text-sm font-medium">{botActive ? 'ACTIVE' : 'INACTIVE'}</span>
                </div>
              </div>

              {walletConnected && (
                <button
                  onClick={toggleBot}
                  className={`w-full py-2 rounded-lg font-medium transition-all ${
                    botActive 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {botActive ? (
                    <>
                      <Pause className="w-4 h-4 inline mr-2" />
                      Stop Trading
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 inline mr-2" />
                      Start Trading
                    </>
                  )}
                </button>
              )}

              {botActive && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Scanning:</span>
                    <span className="font-mono text-blue-600">{tradingPairs[currentScan]}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Portfolio */}
            {walletConnected && (
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Portfolio</h3>
                <div className="space-y-2">
                  {Object.entries(walletBalance).map(([token, balance]) => (
                    parseFloat(balance) > 0 && (
                      <div key={token} className="flex items-center justify-between py-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{getTokenIcon(token)}</span>
                          <span className="text-sm font-medium">{token}</span>
                        </div>
                        <span className="text-sm font-mono">{balance}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Center Panel - Market & Opportunities */}
          <div className="col-span-6">
            
            {/* Market Overview */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-4">Market Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(marketData).map(([token, data]) => (
                  <div key={token} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <span>{getTokenIcon(token)}</span>
                      <span className="font-medium text-sm">{token}</span>
                    </div>
                    <div className="text-lg font-bold">${data.price.toFixed(4)}</div>
                    <div className={`text-xs flex items-center gap-1 ${
                      data.change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {data.change >= 0 ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3" />
                      )}
                      {Math.abs(data.change).toFixed(2)}%
                    </div>
                    <div className="text-xs text-gray-500">Vol: ${formatNumber(Math.round(data.volume))}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trading Opportunities */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Trading Opportunities</h3>
                <div className="flex items-center gap-2">
                  <select 
                    value={selectedTimeframe}
                    onChange={(e) => setSelectedTimeframe(e.target.value)}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="1M">1M</option>
                    <option value="5M">5M</option>
                    <option value="15M">15M</option>
                    <option value="1H">1H</option>
                    <option value="4H">4H</option>
                    <option value="1D">1D</option>
                  </select>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    {opportunities.length} Active
                  </span>
                </div>
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {opportunities.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <LineChart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Scanning for trading opportunities...</p>
                    <p className="text-sm">Connect wallet and start bot to begin</p>
                  </div>
                ) : (
                  opportunities.map(opportunity => (
                    <div key={opportunity.id} className={`p-4 rounded-lg border transition-all ${
                      opportunity.status === 'executing' 
                        ? 'border-yellow-300 bg-yellow-50' 
                        : 'border-gray-200 bg-gray-50'
                    }`}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-medium text-gray-800">{opportunity.strategyName}</div>
                          <div className="text-sm text-gray-600">{opportunity.type}</div>
                          <div className="text-sm font-mono text-blue-600">{opportunity.pair}</div>
                        </div>
                        
                        <div className="text-right">
                          <div className={`font-bold text-lg ${
                            opportunity.signal === 'BUY' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {opportunity.signal}
                          </div>
                          <div className="text-sm text-gray-600">${opportunity.price.toFixed(4)}</div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                        <span>Confidence: {opportunity.confidence.toFixed(1)}%</span>
                        <span>Expected: +${opportunity.expectedProfit.toFixed(2)}</span>
                        <span>Volume: {formatNumber(Math.round(opportunity.volume))}</span>
                      </div>

                      {opportunity.status === 'signing' && (
                        <div className="flex items-center gap-2 text-blue-600 mt-2">
                          <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm font-medium">Waiting for signature...</span>
                        </div>
                      )}

                      {opportunity.status === 'executing' && (
                        <div className="flex items-center gap-2 text-yellow-600 mt-2">
                          <div className="w-3 h-3 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm font-medium">Executing trade...</span>
                        </div>
                      )}

                      {opportunity.status === 'active' && opportunity.confidence > 70 && (
                        <button
                          onClick={() => executeDemo(opportunity)}
                          className="w-full mt-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium"
                        >
                          Sign & Execute Trade
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Stats & Activity */}
          <div className="col-span-3 space-y-6">
            
            {/* Performance Stats */}
            {walletConnected && (
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <h3 className="font-semibold text-gray-800 mb-4">Performance</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total P&L</span>
                    <span className="font-bold text-green-600">${stats.totalProfit.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Today's P&L</span>
                    <span className="font-bold text-blue-600">${stats.dailyProfit.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Trades</span>
                    <span className="font-medium">{stats.totalTrades}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Success Rate</span>
                    <span className="font-medium text-green-600">{stats.successRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Volume</span>
                    <span className="font-medium">${formatNumber(stats.totalVolume.toFixed(0))}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Largest Win</span>
                    <span className="font-medium text-green-600">${stats.largestWin.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Trades */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="font-semibold text-gray-800 mb-4">Recent Trades</h3>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {trades.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    No trades executed yet
                  </div>
                ) : (
                  trades.slice(0, 10).map(trade => (
                    <div key={trade.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <div className="text-sm font-medium">{trade.pair}</div>
                        <div className="text-xs text-gray-600">{formatTime(trade.timestamp)}</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${
                          trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {trade.pnl >= 0 ? '+' : ''}${trade.actualProfit.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-600">{trade.signal}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Activity Log */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="font-semibold text-gray-800 mb-4">Activity Log</h3>
              
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {logs.slice(0, 15).map(log => (
                  <div key={log.id} className="flex items-start gap-2 p-1 text-xs">
                    <div className="mt-0.5">{getLogIcon(log.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-gray-700">{log.message}</div>
                      <div className="text-gray-500 text-xs">{formatTime(log.timestamp)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Signature Modal */}
        {showSignModal && pendingSignature && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4 w-full">
              <div className="text-center mb-4">
                <div className="text-3xl mb-2">✍️</div>
                <h2 className="text-xl font-bold text-gray-900">Sign Transaction</h2>
                <p className="text-gray-600 text-sm">Review and sign this trading transaction</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Strategy:</span>
                    <span className="font-medium">{pendingSignature.opportunity.strategyName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pair:</span>
                    <span className="font-medium">{pendingSignature.opportunity.pair}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Action:</span>
                    <span className={`font-medium ${
                      pendingSignature.opportunity.signal === 'BUY' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {pendingSignature.opportunity.signal}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-mono">${pendingSignature.opportunity.price.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expected Profit:</span>
                    <span className="font-medium text-green-600">
                      +${pendingSignature.opportunity.expectedProfit.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Est. Gas:</span>
                    <span className="font-mono">{pendingSignature.estimatedGas.toFixed(4)} GALA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Slippage:</span>
                    <span className="font-mono">{pendingSignature.slippagePercent.toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <div className="text-xs text-blue-800">
                  <div className="font-medium mb-1">Transaction Details:</div>
                  <div className="font-mono text-xs break-all">
                    To: {pendingSignature.transactionData.to}
                  </div>
                  <div className="font-mono text-xs break-all">
                    Data: {pendingSignature.transactionData.data.slice(0, 32)}...
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleRejectTransaction}
                  className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Reject
                </button>
                <button
                  onClick={handleSignTransaction}
                  className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                >
                  Sign Transaction
                </button>
              </div>

              <div className="mt-3 text-xs text-gray-500 text-center">
                This will open your wallet to confirm the transaction
              </div>
            </div>
          </div>
        )}

        {/* Connect Wallet Prompt */}
        {!walletConnected && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
              <div className="text-4xl mb-4">🔗</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Connect Your Wallet</h2>
              <p className="text-gray-600 mb-6">
                Connect your wallet to start automated trading on GalaSwap DEX
              </p>
              <div className="space-y-2">
                {detectedWallets.slice(0, 2).map((wallet, index) => (
                  <button
                    key={index}
                    onClick={() => connectWallet(wallet.name)}
                    className={`w-full p-3 rounded-lg font-medium transition-all ${
                      wallet.detected 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {wallet.icon} Connect {wallet.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalaSwapTradingBot;