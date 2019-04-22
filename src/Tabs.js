import React, { Component } from 'react';
import { deepMerge } from 'grommet/utils';
import { css } from 'styled-components';

import {
  Configure,
} from 'grommet-icons';

import {
  Box,
  Heading,
  Grommet,
  FormField,
  Tab,
  Tabs,
  Text,
  TextInput,
} from 'grommet';
import { grommet } from 'grommet/themes';

const iostTheme = deepMerge(grommet, {
  global: {
    colors: {
      'dark-1': '#ebebeb',
    },
  },
  tab: {
    active: {
      background: 'dark-1',
      color: '#355fe6',
      border: '#355fe6',
    },
    border: undefined,
    background: 'dark-1',
    color: '#6c6c6c',
    hover: {
      background: 'dark-1',
    },
  },
  tabs: {
    background: 'white',
    header: {
      background: 'dark-1',
    },
  },
});


class ControlledTabs extends Component {
  constructor(props) {
    super(props);

    this.state = { index: 0 };

    this.onActive = this.onActive.bind(this);
  }

  onActive(index) {
    this.setState({ index });
  }

  render() {
    const { index } = this.state;
    const {
      PriceComponent, PortfolioComponent, VotesComponent, SettingsComponent,
    } = this.props;
    return (
      <Grommet theme={iostTheme}>
        <Tabs activeIndex={index} onActive={this.onActive}>
          <Tab title="Price">
            <Box margin="small">
              {PriceComponent}
            </Box>
          </Tab>
          <Tab title="Portfolio">
            <Box margin="small">
              {PortfolioComponent}
            </Box>
          </Tab>
          <Tab title="Votes">
            <Box margin="small">
              {VotesComponent}
            </Box>
          </Tab>
          <Tab title={<Configure size="small" />}>
            <Box margin="small">
              {SettingsComponent}
            </Box>
          </Tab>
        </Tabs>
      </Grommet>
    );
  }
}

module.exports = ControlledTabs;
