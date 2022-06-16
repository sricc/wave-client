import { useState, useEffect, useCallback } from 'react';
import { useContract } from './useContract';
import WavePortal from "./WavePortal.json";

const CONTRACT_ADDRESS = '0x058633eE27F7F7ef5344dce2B9Cd7E9e16EFc63d';
const ABI = WavePortal.abi;

export const useWavePortal = ({ provider, account }) => {
  const [allWaves, setAllWaves] = useState([]);
  const [ isMining, setIsMining ] = useState(false);
  const [ totalWaves, setTotalWaves ] = useState(0);
  const [ yourWaves, setYourWaves ] = useState(0);
  const wavePortalContract = useContract(
    CONTRACT_ADDRESS,
    ABI,
    provider,
    account,
  );

  const wave = async (message) => {
    const waveTxn = await wavePortalContract.wave(message);
    setIsMining(true);
    console.log('Mining...', waveTxn.hash);

    await waveTxn.wait();
    setIsMining(false);
    console.log('Mined -- ', waveTxn.hash);
    await getWaveCounts(account);
    await getAllWaves();
  }

  const getAllWaves = useCallback(async () => {
    try {
      if (provider) {
        const waves = await wavePortalContract.getAllWaves();
        const wavesCleaned = waves.map(wave => ({
          address: wave.waver,
          timestamp: new Date(wave.timestamp * 1000),
          message: wave.message
        }));

        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }, [wavePortalContract, provider]);

  const getWaveCounts = useCallback(async (account) => {
    const _totalWaves = await wavePortalContract.totalWaves();
    const _yourWaves = await wavePortalContract.wavesByAddress(account);
    setTotalWaves(Number(_totalWaves));
    setYourWaves(Number(_yourWaves))
  }, [wavePortalContract]);

  useEffect(() => {
    const onNewWave = (address, timestamp, message) => {
      console.log('NewWave', address, timestamp, message);
      setAllWaves(prevState => [
        ...prevState,
        {
          address,
          timestamp: new Date(timestamp * 1000),
          message,
        },
      ]);
    };

    if (wavePortalContract && account) {
      getWaveCounts(account);
      getAllWaves();

      wavePortalContract.on("NewWave", onNewWave);
    }

    return () => {
      if (wavePortalContract) {
        wavePortalContract.off("NewWave", onNewWave);
      }
    };
  }, [wavePortalContract, account, getWaveCounts, getAllWaves]);

  return {
    wave,
    allWaves,
    totalWaves,
    yourWaves,
    isMining,
  };
}
