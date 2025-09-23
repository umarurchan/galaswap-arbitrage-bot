// Lightweight web3 utilities for MetaMask and GalaChain network handling

export function getInjectedProvider() {
  if (typeof window === 'undefined') return null;
  if (window.ethereum) return window.ethereum;
  return null;
}

export async function requestAccounts(provider) {
  const accounts = await provider.request({ method: 'eth_requestAccounts' });
  if (!accounts || accounts.length === 0) {
    throw new Error('No accounts returned from wallet');
  }
  return accounts;
}

export async function ensureGalaChainNetwork(provider) {
  const chainIdHex = process.env.REACT_APP_GALACHAIN_CHAIN_ID_HEX;
  const chainName = process.env.REACT_APP_GALACHAIN_CHAIN_NAME;
  const rpcUrls = (process.env.REACT_APP_GALACHAIN_RPC_URLS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const blockExplorerUrls = (process.env.REACT_APP_GALACHAIN_BLOCK_EXPLORERS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const currencyName = process.env.REACT_APP_GALACHAIN_CURRENCY_NAME || 'Gala';
  const currencySymbol = process.env.REACT_APP_GALACHAIN_CURRENCY_SYMBOL || 'GALA';
  const currencyDecimals = parseInt(
    process.env.REACT_APP_GALACHAIN_CURRENCY_DECIMALS || '18',
    10
  );

  if (!chainIdHex || !rpcUrls.length || !chainName) {
    // Missing configuration; skip network switching
    return { switched: false, reason: 'Missing GalaChain env config' };
  }

  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainIdHex }],
    });
    return { switched: true };
  } catch (switchError) {
    // 4902 = Unrecognized chain
    if (switchError && switchError.code === 4902) {
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: chainIdHex,
            chainName,
            rpcUrls,
            nativeCurrency: {
              name: currencyName,
              symbol: currencySymbol,
              decimals: currencyDecimals,
            },
            blockExplorerUrls,
          },
        ],
      });
      return { switched: true, added: true };
    }
    throw switchError;
  }
}

export async function sendTransaction(provider, tx) {
  // Ensure from is set
  if (!tx.from) {
    const accounts = await requestAccounts(provider);
    tx.from = accounts[0];
  }
  const txHash = await provider.request({
    method: 'eth_sendTransaction',
    params: [tx],
  });
  return txHash;
}

export function isSendEnabled() {
  return String(process.env.REACT_APP_ENABLE_SEND || '').toLowerCase() === 'true';
}

