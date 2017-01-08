import React, { Component } from 'react'

import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'

export default class NewCookbookDialog extends Component {
  render() {
    const { open, onSubmit, onCancel } = this.props;

		const actions = [
			<FlatButton
				label="Submit"
				primary={true}
				keyboardFocused={true}
        onTouchTap={() => onSubmit(this.refs.name.input.value, this.refs.description.input.value)}
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
        id='newCookbookDialog'
        open={open}
        modal={true}
        actions={actions}
      >
        <div>
          <TextField
            hintText="Name"
            floatingLabelText="Name"
            ref="name"
          />
        </div>
        <div>
          <TextField
            hintText="Description"
            floatingLabelText="Description"
            ref="description"
          />
        </div>
      </Dialog>
    )
  }
}
