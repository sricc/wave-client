import React, { useState } from "react";
import { useWavePortal, useMetaMask } from './hooks';
import EthereumLogo from './EthereumLogo';
import './App.css';

export default function App() {
  const metaMask = useMetaMask();
  const [ message, setMessage ] = useState('');
  const [ sortOrder, setSortOrder ] = useState('descending');
  const { wave, allWaves, totalWaves, yourWaves, isMining } = useWavePortal({
    provider: metaMask.provider,
    account: metaMask.account,
  });

  const handleWave = async () => {
    try {
      await wave(message);
      setMessage('');
    } catch(error) {
      console.error('Something went wrong with the wave:', error);
    }
  }

  const allWavesSorted = allWaves
    .filter(({ message }) => Boolean(message))
    .sort(({ timestamp: a }, { timestamp: b }) =>
      (sortOrder === 'ascending') ? a - b : b - a
    );

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
                      <>
                        <label htmlFor="wave-message">
                          Send a message
                          <textarea
                            className="formField"
                            id="wave-message"
                            type="text"
                            maxLength="150"
                            placeholder="This is the message I will send with my wave..."
                            value={message}
                            onChange={({ target }) => setMessage(target.value)}
                          />
                        </label>

                        <button className="button waveButton" onClick={handleWave} disabled={!message || isMining}>
                          {
                            isMining ? 'Mining...'
                            : message ? 'Wave at Me'
                            : 'Add a message to wave...'  }
                        </button>
                      </>
                    )
                  :
                    (
                      <button className="button connectButton" onClick={metaMask.connect}>
                        Connect Wallet
                      </button>
                    )
              }

              <section className="wavesSection">
                <header className="wavesHeader">
                  <h2>All waves</h2>
                  <label htmlFor="sort-order">
                    Sort Order:
                    <select
                      className="formField"
                      name="sortOrder"
                      id="sort-order"
                      disabled={Boolean(allWavesSorted.length)}
                      value={sortOrder}
                      onChange={({ target }) => setSortOrder(target.value)}
                    >
                      <option value="descending">Newest First</option>
                      <option value="ascending">Oldest First</option>
                    </select>
                  </label>
                </header>
                <div className="wavesList">
                  {
                    allWavesSorted.length
                      ? allWavesSorted.map((wave, index) => (
                          <div key={`wave-${index}`} className="wave">
                            <div className="waveMessage">"{wave.message}"</div>
                            <div className="waveAddress">From {wave.address}</div>
                            <div className="waveTime">Sent on {wave.timestamp.toString()}</div>
                          </div>
                        ))
                      :
                        (
                          <div className="noWaves">Looks like there are no waves yet... let's change that!</div>
                        )
                  }
                </div>
              </section>
            </>
          )
        }
      </div>
    </div>
  );
}
