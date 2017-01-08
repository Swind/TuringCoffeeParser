import React, { Component } from 'react'
import { Link } from 'react-router'

import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'

class Sidebar extends Component {
  render() {

    const { open, onClose, menus } = this.props
    const menuItems = menus.map((v) => (
      <Link key={v.name} to={v.path}>
        <MenuItem onTouchTap={onClose}>
          { v.name }
        </MenuItem>
      </Link>
    ))

    return (
      <Drawer
        docked={false}
        open={open}
        onRequestChange={onClose}
      >
        { menuItems }
      </Drawer>
    )
  }
}

export default Sidebar
