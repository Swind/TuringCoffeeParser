/**
 * In this file, we create a React component
 * which incorporates components providedby material-ui.
 */

import React, {Component} from 'react'
import { Link } from 'react-router'

import {deepOrange500} from 'material-ui/styles/colors'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import FlatButton from 'material-ui/FlatButton'
import NavigationMenu from 'material-ui/svg-icons/navigation/menu'

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
    this.state = {open: false};
  }

  handleToggle() {
    this.setState({open: !this.state.open})
  }

  handleClose() {
    this.setState({open: false})
  }

  render() {
    const {cookbooks, children} = this.props
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <Header
            key='Header'
            onLeftIconButtonTouchTap={this.handleToggle.bind(this)}
            showMenuIconButton={true}
          />
          <Drawer
            docked={false}
            width={200}
            open={this.state.open}
            onRequestChange={(open) => this.setState({open})}
          >
            <Link to="/">
              <MenuItem onTouchTap={this.handleClose.bind(this)}>
                Barista
              </MenuItem>
            </Link>
            <Link to="/monitor">
              <MenuItem onTouchTap={this.handleClose.bind(this)}>
                Monitor
              </MenuItem>
            </Link>
          </Drawer>
          {children}
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Main
