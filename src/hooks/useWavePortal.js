import { useState, useEffect, useCallback } from 'react';
import { useContract } from './useContract';
import WavePortal from "./WavePortal.json";

const CONTRACT_ADDRESS = '0x6BA7933676eCdc05e092823457e208b33ba518bc';
const ABI = WavePortal.abi;

export const useWavePortal = ({ provider, account }) => {
  const [ isMining, setIsMining ] = useState(false);
  const [ totalWaves, setTotalWaves ] = useState(0);
  const [ yourWaves, setYourWaves ] = useState(0);
  const wavePortalContract = useContract(
    CONTRACT_ADDRESS,
    ABI,
    provider,
    account,
  );

  const wave = async () => {
    const waveTxn = await wavePortalContract.wave();
    setIsMining(true);
    console.log('Mining...', waveTxn.hash);

    await waveTxn.wait();
    setIsMining(false);
    console.log('Mined -- ', waveTxn.hash);
    await getWaves(account);
  }

  const getWaves = useCallback(async (account) => {
    const _totalWaves = await wavePortalContract.totalWaves();
    const _yourWaves = await wavePortalContract.wavesByAddress(account);
    setTotalWaves(Number(_totalWaves));
    setYourWaves(Number(_yourWaves))
  }, [wavePortalContract]);

  useEffect(() => {
    if (wavePortalContract && account) {
      getWaves(account);
    }
  }, [wavePortalContract, account, getWaves]);

  return {
    wave,
    totalWaves,
    yourWaves,
    isMining,
  };
}
