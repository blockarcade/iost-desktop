const {
  app, BrowserWindow, ipcMain, Tray,
} = require('electron');
const path = require('path');
const Store = require('electron-store');
const fetch = require('node-fetch');
const { enableLiveReload } = require('electron-compile');
const shortNumber = require('short-number');
const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');

enableLiveReload();

const DISPLAYS = {
  ACCOUNT_BALANCE: 'ACCOUNT_BALANCE',
  IOST_PRICE: 'IOST_PRICE',
  TOTAL_NODE_VOTES: 'TOTAL_NODE_VOTES',
  RAM: 'RAM',
  GAS: 'GAS',
};

const store = new Store({
  defaults: {
    accounts: {},
    display: DISPLAYS.ACCOUNT_BALANCE,
    selectedAccount: '',
  },
});

const NODE_URL = 'http://18.209.137.246:30001';
const PRICE_FEED_URL = 'https://api.binance.com/api/v3/avgPrice?symbol=IOSTUSDT';
const TOTAL_NODE_VOTES_URL = 'https://www.iostabc.com/api/voters';
const assetsDirectory = path.join(__dirname, '..', 'assets');

let tray;
let window;

// Don't show the app in the dock.
if (process.platform === 'darwin') app.dock.hide();

app.on('ready', () => {
  createTray();
  createWindow();
});

// Quit the app when the window is closed
app.on('window-all-closed', () => {
  app.quit();
});

let trayTimer;

const updateTray = () => {
  clearTimeout(trayTimer);

  const display = store.get('display');
  const accounts = store.get('accounts');
  const selectedAccount = store.get('selectedAccount');
  let action = Promise.resolve();

  // TODO: We need to fetch account and price each time.

  if (display === DISPLAYS.ACCOUNT_BALANCE) {
    if (Object.keys(accounts).length === 0) {
      // The user needs to add an account.
      tray.setTitle('Click to start!');
    } else {
      action = fetch(`${NODE_URL}/getAccount/${selectedAccount}/true`)
        .then(res => res.json())
        .then((json) => {
          tray.setTitle(`${json.balance.toFixed(2)}`);
        });
    }
  } else if (display === DISPLAYS.RAM) {
    if (Object.keys(accounts).length === 0) {
      // The user needs to add an account.
      tray.setTitle('Click to start!');
    } else {
      action = fetch(`${NODE_URL}/getAccount/${selectedAccount}/true`)
        .then(res => res.json())
        .then((json) => {
          tray.setTitle(`${(Number(json.ram_info.available) / 1024).toFixed(2)}KB`);
        });
    }
  } else if (display === DISPLAYS.GAS) {
    if (Object.keys(accounts).length === 0) {
      // The user needs to add an account.
      tray.setTitle('Click to start!');
    } else {
      action = fetch(`${NODE_URL}/getAccount/${selectedAccount}/true`)
        .then(res => res.json())
        .then((json) => {
          tray.setTitle(`${shortNumber(Number(json.gas_info.current_total).toFixed(0))} iGAS`);
        });
    }
  } else if (display === DISPLAYS.IOST_PRICE) {
    action = fetch(PRICE_FEED_URL)
      .then(res => res.json())
      .then((json) => {
        tray.setTitle(`$${Number(json.price).toFixed(4)}`);
        // TODO: Send the render event and update the price.
        window.price = Number(json.price);
        window.webContents.send('reRender');
      });
  } else if (display === DISPLAYS.TOTAL_NODE_VOTES) {
    action = fetch(`${TOTAL_NODE_VOTES_URL}/${selectedAccount}`)
      .then(res => res.json())
      .then((json) => {
        const total = json.voters.reduce((totalVotes, num) => totalVotes + Number(num.votes), 0);
        tray.setTitle(`${shortNumber(total)}`);
      });
  }

  return action
    .then(() => {
      trayTimer = setTimeout(updateTray, 60000);
    })
    .catch(e => console.log(e) || setTimeout(updateTray, 10000));
};

const createTray = () => {
  tray = new Tray(path.join(assetsDirectory, 'trayWhite.png'));
  tray.on('right-click', toggleWindow);
  tray.on('double-click', toggleWindow);
  tray.on('click', (event) => {
    toggleWindow();

    // Show devtools when command clicked
    if (window.isVisible() && process.defaultApp && event.metaKey) {
      window.openDevTools({ mode: 'detach' });
    }
  });

  updateTray();
};

const getWindowPosition = () => {
  const windowBounds = window.getBounds();
  const trayBounds = tray.getBounds();

  // Center window horizontally below the tray icon
  const x = Math.round(trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2);

  // Position window 4 pixels vertically below the tray icon
  const y = Math.round(trayBounds.y + trayBounds.height + 4);

  return { x, y };
};

const createWindow = () => {
  installExtension(REACT_DEVELOPER_TOOLS)
    .then(name => console.log(`Added Extension:  ${name}`))
    .catch(err => console.log('An error occurred: ', err));

  window = new BrowserWindow({
    width: 300,
    height: 400,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    // transparent: true,
    webPreferences: {
      // Prevents renderer process code from not running when window is
      // hidden
      backgroundThrottling: false,
    },
  });

  // TODO: Uncomment to open devtools.
  window.openDevTools({ mode: 'detach' });
  window.loadURL(`file://${path.join(__dirname, 'index.html')}`);

  // Hide the window when it loses focus
  window.on('blur', () => {
    if (!window.webContents.isDevToolsOpened()) {
      window.hide();
    }
  });

  window.accounts = store.get('accounts');
  window.selectedAccount = store.get('selectedAccount');
  window.display = store.get('display');
};

const toggleWindow = () => {
  if (window.isVisible()) {
    window.hide();
  } else {
    showWindow();
  }
};

const showWindow = () => {
  const position = getWindowPosition();
  window.setPosition(position.x, position.y, false);
  window.show();
  window.focus();
};

ipcMain.on('newAccount', (event, account) => {
  const accounts = store.get('accounts');
  accounts[account] = account;
  store.set('accounts', accounts);
  store.set('selectedAccount', account);

  updateTray();

  // Notify render process of new accounts.
  window.accounts = accounts;
  window.selectedAccount = account;
  event.sender.send('reRender');
});

ipcMain.on('updateSelectedAccount', (event, account) => {
  store.set('selectedAccount', account);

  // Update Tray label.
  updateTray();

  // Notify render process of new accounts.
  window.selectedAccount = account;
  event.sender.send('reRender');
});

ipcMain.on('updateDisplay', (event, display) => {
  store.set('display', display);
  window.display = display;

  // Update Tray label.
  updateTray();

  // Update display.
  event.sender.send('reRender');
});
