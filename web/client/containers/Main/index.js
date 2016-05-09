/**
 * In this file, we create a React component
 * which incorporates components providedby material-ui.
 */

import React, {Component} from 'react'

import {deepOrange500} from 'material-ui/styles/colors'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import Header from '../../components/Header'
import CookbookList from '../CookbookList'

const styles = {
  container: {
    textAlign: 'center',
    paddingTop: 200,
  },
};

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500,
  },
});

class Main extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const {cookbooks, children} = this.props
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <Header key='Header'/>
          {children}
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Main
