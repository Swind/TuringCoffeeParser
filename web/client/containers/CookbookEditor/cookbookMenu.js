import React, { Component } from 'react'
import { Link } from 'react-router'

import Paper from 'material-ui/Paper'
import IconButton from 'material-ui/IconButton'

import SaveIcon from 'material-ui/svg-icons/content/save'
import ExitIcon from 'material-ui/svg-icons/action/exit-to-app'

class CookbookMenu extends Component {
  render() {

    const {onSaveCookbook} = this.props

    return (
      <Paper zDepth={1}>
        <IconButton tooltip='Save' onMouseUp={onSaveCookbook}>
          <SaveIcon />
        </IconButton>
        <Link to='/'>
          <IconButton tooltip='Exit'>
            <ExitIcon />
          </IconButton>
        </Link>
      </Paper>
    )
  }
}

export default CookbookMenu
