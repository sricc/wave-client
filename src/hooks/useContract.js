import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

export const useContract = (contractAddress, contractABI, web3Provider, account) => {
  const [ contract, setContract ] = useState(null);

  const getContract = useCallback(async () => {
    try {
      const provider = new ethers.providers.Web3Provider(web3Provider);
      const signer = provider.getSigner();
      const signerAddress = await signer.getAddress();
      if (signerAddress) {
        setContract(
          new ethers.Contract(contractAddress, contractABI, signer)
        );
      }
    } catch(error) {
      console.log('[useContract] Could not initialize:', error);
    }
  }, [contractAddress, contractABI, web3Provider]);

  useEffect(() => {
    if (web3Provider && account) {
      getContract();
    }
  }, [web3Provider, account, getContract]);

  return contract;
};
