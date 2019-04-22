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
    } = this.props;

    const { newAccount } = this.state;

    return [
      <Tabs
        key="tabs"
        PriceComponent={<div>Test</div>}
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
          </div>
)}
      />,

    ];
    return [
      e(Header, { key: 'header' }),
      e(
        'form',
        { key: 'body' },
        [
          e(
            'p',
            { key: 'accountname' },
            e('input', {
              type: 'text',
              placeholder: 'New Account Name',
              value: newAccount,
              onChange: e => this.setState({ newAccount: e.target.value }),
            }),
          ),
          e('input', {
            key: 'add',
            type: 'submit',
            value: 'Add Account',
            onClick: (e) => {
              e.preventDefault();
              addNewAccount(newAccount);
              this.setState({ newAccount: '' });
            },
          }),
        ],
      ),
    ];
  }
}

module.exports = App;
