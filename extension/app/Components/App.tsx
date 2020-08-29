import React, { useState, useEffect } from 'react';
import GitHubIcon from '@material-ui/icons/GitHub';
import Recorder from './Recorder';

const App: React.FC = () => {
  const [status, setStatus] = useState(true);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Create a connection to the background page
    const backgroundConnection = chrome.runtime.connect();
    // Send tab ID to background.js
    backgroundConnection.postMessage({
      action: 'init',
      tabId: chrome.devtools.inspectedWindow.tabId,
    });
    // Listen for messages from background.js
    backgroundConnection.onMessage.addListener((message) => {
      if (message.action === 'moduleConnected') {
        setConnected(true);
      }
      if (message.action === 'setStatus') {
        setStatus(!status);
      }
    });
  }, [connected]);

  return connected ? (
    <div className="App">
      <div className="row">chromogen</div>
      <Recorder status={status} />
    </div>
  ) : (
    <div id="installContainer">
      <div />
      <div id="installMessage">
        <div>Please </div>
        {/* <a href="https://www.npmjs.com/package/chromogen">npm install chromogen </a> */}
        <code>npm install chromogen </code>

        <div>in your app before using this extension. </div>
        <div>
          <GitHubIcon /> <span>github.com/oslabs-beta/Chromogen</span>
        </div>
      </div>
      <div />
    </div>
  );
};

export default App;
