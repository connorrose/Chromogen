import React, { useState, useEffect } from 'react';
import Recorder from './Recorder.jsx';

const App = () => {
  useEffect(() => {
    // Create a connection to the background page
    const backgroundConnection = chrome.runtime.connect();
    // send tab ID to background page
    backgroundConnection.postMessage({
      action: 'init',
      tabId: chrome.devtools.inspectedWindow.tabId,
    });
  }, []);
  return (
    <div className="App">
      <div className="row"> </div>
      <Recorder />
    </div>
  );
};

export default App;
