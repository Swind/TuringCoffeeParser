import React, { Component } from 'react'

import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'

export default class DeleteCookbookDialog extends Component {
  render() {
    const { open, onSubmit, onCancel, name } = this.props
    const actions = [
			<FlatButton
				label="Submit"
				primary={true}
				keyboardFocused={true}
				onTouchTap={onSubmit}
			/>,
      <FlatButton
				label="Cancel"
				primary={true}
				keyboardFocused={true}
				onTouchTap={onCancel}
      />
    ]

    return (
      <Dialog
        id='deleteCookbook'
        open={open}
        modal={true}
        actions={actions}
      >
        <div>DO YOU WANT TO DELETE '{name}'</div>
      </Dialog>
    )
  }
}
