const React = require('react');
const { default: Select } = require('react-select');

const e = React.createElement;

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
    } = this.props;

    const { newAccount } = this.state;

    return [
      e(
        'h1',
        { key: 'h1' },
        'IOST Desktop',
      ),
      e(
        Select,
        {
          key: 'select',
          value: selectedAccount,
          options: Object.keys(accounts).map(account => ({ value: account, label: account })),
          onChange: newSelectedAccount => updateSelectedAccount(newSelectedAccount),
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
