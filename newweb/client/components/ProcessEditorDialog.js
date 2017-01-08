import React, { Component } from 'react'

import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'

import ProcessEditor from './ProcessEditor'

export default class ProcessEditorDialog extends Component {
  render() {
    const { open, onSubmit, onCancel, onChange, process } = this.props

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
        open={open}
        modal={true}
        onRequestClose={onCancel}
        actions={actions}
      >
        <ProcessEditor process={process} onChange={onChange}/>
      </Dialog>
    )
  }
}
