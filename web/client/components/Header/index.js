import React, { Component } from 'react'
import AppBar from 'material-ui/AppBar';

class Header extends Component {
  render() {
    const {onLeftIconButtonTouchTap} = this.props
    return (
        <AppBar
          title='Barista'
          onLeftIconButtonTouchTap={onLeftIconButtonTouchTap}
        />
    )
  }
}

export default Header
