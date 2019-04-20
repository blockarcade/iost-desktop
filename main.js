const {
  app, BrowserWindow, ipcMain, Tray,
} = require('electron');
const path = require('path');
const Store = require('electron-store');
const fetch = require('node-fetch');

const {
  default: installExtension,
  REACT_DEVELOPER_TOOLS,
} = require('electron-devtools-installer');

const DISPLAYS = { ACCOUNT_BALANCE: 0 };
const store = new Store({
  defaults: {
    accounts: {},
    display: DISPLAYS.ACCOUNT_BALANCE,
    selectedAccount: '',
  },
});

const NODE_URL = 'http://18.209.137.246:30001';

const assetsDirectory = path.join(__dirname, 'assets');

let tray;
let window;

// Don't show the app in the doc
app.dock.hide();

app.on('ready', () => {
  createTray();
  createWindow();
});

// Quit the app when the window is closed
app.on('window-all-closed', () => {
  app.quit();
});

let trayTimer = undefined;

const updateTray = () => {
  const display = store.get('display');
  const accounts = store.get('accounts');
  const selectedAccount = store.get('selectedAccount');
  let action = Promise.resolve();

  if (display === DISPLAYS.ACCOUNT_BALANCE) {
    if (Object.keys(accounts).length === 0) {
      // The user needs to add an account.
      tray.setTitle('Click to start!');
    } else {
      action = fetch(`${NODE_URL}/getAccount/${selectedAccount}/true`)
        .then(res => res.json())
        .then(json => {
          tray.setTitle(`${json.balance.toFixed(2)}`);
        });
    }
  }

  return action.then(() => {
    trayTimer = setTimeout(updateTray, 60000);
  })
  .catch((e) => console.log(e) || setTimeout(updateTray, 10000));
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
  const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2));

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
    height: 450,
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

  updateTray();

  // Notify render process of new accounts.
  window.accounts = accounts;
  event.sender.send('newAccount');
});

ipcMain.on('updateSelectedAccount', (event, account) => {
  store.set('selectedAccount', account);

  // Notify render process of new accounts.
  window.selectedAccount = account;
  event.sender.send('updateSelectedAccount');
});

// ipcMain.on('weather-updated', (event, weather) => {
//   // Show "feels like" temperature in tray
//   tray.setTitle(`${Math.round(weather.currently.apparentTemperature)}°`)

//   // Show summary and last refresh time as hover tooltip
//   const time = new Date(weather.currently.time).toLocaleTimeString()
//   tray.setToolTip(`${weather.currently.summary} at ${time}`)

//   // Update icon for different weather types
//   switch (weather.currently.icon) {
//     case 'cloudy':
//     case 'fog':
//     case 'partly-cloudy-day':
//     case 'partly-cloudy-night':
//       tray.setImage(path.join(assetsDirectory, 'cloudTemplate.png'))
//       break
//     case 'rain':
//     case 'sleet':
//     case 'snow':
//       tray.setImage(path.join(assetsDirectory, 'umbrellaTemplate.png'))
//       break
//     case 'clear-night':
//       tray.setImage(path.join(assetsDirectory, 'moonTemplate.png'))
//       break
//     case 'wind':
//       tray.setImage(path.join(assetsDirectory, 'flagTemplate.png'))
//       break
//     case 'clear-day':
//     default:
//       tray.setImage(path.join(assetsDirectory, 'sunTemplate.png'))
//   }
// })
