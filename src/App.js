/* eslint react/jsx-filename-extension: 0 */
import Price from './Price.js';

const React = require('react');
const { default: Select } = require('react-select');

const Tabs = require('./Tabs.js');

const e = React.createElement;


const selectStyle = {
  option: (styles, {
    data, isDisabled, isFocused, isSelected,
  }) => Object.assign(styles, {
    color: 'black',
  }),
};

// TODO Pull these from the backend.
const displayOptions = [
  {
    value: 'ACCOUNT_BALANCE',
    label: 'Account Balance',
  },
  {
    value: 'IOST_PRICE',
    label: 'IOST Price',
  },
  {
    value: 'TOTAL_NODE_VOTES',
    label: 'Total Votes for Node',
  },
  {
    value: 'RAM',
    label: 'iRAM Available',
  },
  // {
  //   value: 'GAS',
  //   label: 'iGAS Available',
  // },
];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { newAccount: '' };
  }

  render() {
    const {
      accounts,
      addNewAccount,
      selectedAccount,
      updateSelectedAccount,
      display,
      updateDisplay,
      price,
      quit,
    } = this.props;

    const { newAccount } = this.state;

    return [
      <Tabs
        key="tabs"
        PriceComponent={<Price price={price} />}
        PortfolioComponent={<h1>Coming Soon</h1>}
        VotesComponent={<h1>Coming Soon</h1>}
        SettingsComponent={(
          <div>
            <h2>Display</h2>
            <Select
              value={displayOptions.find(option => option.value === display)}
              options={displayOptions}
              onChange={newDisplay => updateDisplay(newDisplay.value)}
              styles={selectStyle}
            />
            <h2>Account</h2>
            <Select
              value={{ value: selectedAccount, label: selectedAccount }}
              options={Object.keys(accounts).map(account => ({ value: account, label: account }))}
              onChange={newSelectedAccount => updateSelectedAccount(newSelectedAccount.value)}
              styles={selectStyle}
            />
            <form>
              <p>
                <input
                  type="text"
                  placeholder="New Account Name"
                  value={newAccount}
                  onChange={e => this.setState({ newAccount: e.target.value })}
                />
              </p>
              <p>
                <input
                  key="add"
                  type="submit"
                  value="Add Account"
                  onClick={(e) => {
                    e.preventDefault();
                    addNewAccount(newAccount);
                    this.setState({ newAccount: '' });
                  }}
                />
              </p>
            </form>
            <input
              key="exit"
              type="button"
              value="Quit Application"
              onClick={(e) => {
                e.preventDefault();
                quit();
              }}
            />
          </div>
)}
      />,
    ];
  }
}

module.exports = App;
