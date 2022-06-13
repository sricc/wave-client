import React from "react";
import { useWavePortal, useMetaMask } from './hooks';
import EthereumLogo from './EthereumLogo';
import './App.css';

export default function App() {
  const metaMask = useMetaMask();
  const { wave, totalWaves, yourWaves, isMining } = useWavePortal({
    provider: metaMask.provider,
    account: metaMask.account,
  });

  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
          <span role="img" aria-label="hand-wave">👋</span> Hey there!
        </div>

        <div className="bio">
          I'm Steve! Connect your Ethereum wallet and wave at me!
        </div>

        <EthereumLogo className="etheremLogo" />

        {
          !metaMask.isInstalled && (
            <div className="noMetaMask">
              Please install MetaMask
            </div>
          )
        }

        {
          metaMask.isInstalled && (
            <>
              <div className="waveCount">
                <div className="totalWaves">
                  Total Waves: {totalWaves}
                </div>

                <div className="yourWaves">
                  (You've waved {yourWaves} times)
                </div>
              </div>

              {
                metaMask.isConnected
                  ?
                    (
                      <button className="button waveButton" onClick={wave} disabled={isMining}>
                        { isMining ? 'Mining...' : 'Wave at Me' }
                      </button>
                    )
                  :
                    (
                      <button className="button connectButton" onClick={metaMask.connect}>
                        Connect Wallet
                      </button>
                    )
              }
            </>
          )
        }
      </div>
    </div>
  );
}
