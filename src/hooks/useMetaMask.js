import { useEffect, useState, useCallback } from 'react';
import detectEthereumProvider from '@metamask/detect-provider'

export const useMetaMask = () => {
  const [ provider, setProvider ] = useState(null);
  const [ account, setAccount ] = useState(null);
  const [ isConnected, setIsConnected ] = useState(false);
  const { ethereum } = window;
  const isInstalled = Boolean(ethereum);

  const request = useCallback(async (method) => {
    try {
      return await provider.request({ method });
    } catch(error) {
      return new Error(error);
    }
  }, [provider]);

  const handleAccounts = useCallback((accounts = []) => {
    setAccount(accounts[0]);
    setIsConnected(Boolean(accounts.length));
  }, []);

  const getAccounts = useCallback(async (requestMethod) => {
    try {
      const accounts = await request(requestMethod);
      console.log('[useMetaMask] Found accounts:', accounts);
      handleAccounts(accounts);
    } catch(error) {
      console.error('[useMetaMask] No accounts found:', error);
      handleAccounts();
    }
  }, [request, handleAccounts]);

  const refreshPage = () => {
    window.location.reload();
  };

  const connect = () => {
    getAccounts('eth_requestAccounts');
  };

  useEffect(() => {
    const getProvider = async () => {
      const _provider = await detectEthereumProvider({ mustBeMetaMask: true });
      if (_provider) {
        setProvider(_provider);
      } else {
        console.error('[useMetaMask] Please install MetaMask');
      }
    };
    getProvider();
  }, []);

  useEffect(() => {
    if(provider) {
      provider.on('accountsChanged', handleAccounts);
      provider.on('chainChanged', refreshPage);
    }
  }, [provider, handleAccounts]);

  useEffect(() => {
    if (isInstalled && provider) {
      getAccounts('eth_accounts');
    }
  }, [isInstalled, provider, getAccounts]);

  return {
    provider,
    isInstalled,
    isConnected,
    connect,
    account,
  };
}
