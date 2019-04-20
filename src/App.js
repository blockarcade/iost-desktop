const React = require('react');
const { default: Select } = require('react-select');

const e = React.createElement;


const selectStyle = {
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      color: 'black',
    };
  },
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
      e(
        'h1',
        { key: 'h1' },
        'IOST Desktop',
      ),
      e(
        'h2',
        { key: 'h2-display' },
        'Display',
      ),
      e(
        Select,
        {
          key: 'select-display',
          value: displayOptions.find(option => option.value === display),
          options: displayOptions,
          onChange: newDisplay => updateDisplay(newDisplay.value),
          styles: selectStyle,
        },
      ),
      e(
        'h2',
        { key: 'h2-account' },
        'Account',
      ),
      e(
        Select,
        {
          key: 'select-account',
          value: { value: selectedAccount, label: selectedAccount },
          options: Object.keys(accounts).map(account => ({ value: account, label: account })),
          onChange: newSelectedAccount => updateSelectedAccount(newSelectedAccount.value),
          styles: selectStyle,
        },
      ),
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
