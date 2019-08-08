const React = require('react');
const ReactDOM = require('react-dom');
const { ipcRenderer } = require('electron');
const { remote } = require('electron');
const App = require('./App.js');

const e = React.createElement;
const win = remote.getCurrentWindow();

const domContainer = document.querySelector('#root');

const addNewAccount = account => ipcRenderer.send('newAccount', account);
const updateSelectedAccount = account => ipcRenderer.send('updateSelectedAccount', account);
const updateDisplay = display => ipcRenderer.send('updateDisplay', display);

const render = () => ReactDOM.render(
  e(
    App,
    {
      addNewAccount,
      updateSelectedAccount,
      updateDisplay,
      accounts: win.accounts,
      selectedAccount: win.selectedAccount,
      display: win.display,
      price: win.price,
    },
  ),
  domContainer,
);

// Re-render when we get a new account.
ipcRenderer.on('reRender', render);

render();
