import React, { Component } from 'react'
import { push } from 'react-router-redux'

import AppBar from 'material-ui/AppBar'
import Sidebar from './Sidebar'

class Header extends Component {
  render() {
    const { openSidebar, onCloseSidebar, onOpenSidebar, menus } = this.props
    return (
      <div>
        <AppBar title="Coffee" onLeftIconButtonTouchTap={onOpenSidebar}/>
        <Sidebar open={openSidebar} onClose={onCloseSidebar} menus={menus}/>
      </div>
    )
  }
}

export default Header
