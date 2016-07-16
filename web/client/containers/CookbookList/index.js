import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import AddIcon from 'material-ui/svg-icons/content/add'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

import CookbookCard from '../../components/CookbookCard'
import * as CookbookActions from '../../actions/cookbooks'

class CookbookDialog extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = {open: false}
  }

  render() {

    const {style, onCreateCookbook} = this.props

    const onCancel = () => {
      this.setState({open: false})
    }

    const onCreate = () => {
      onCreateCookbook({
        name: this.state.name,
        description: this.state.name,
        processes: []
      })
      this.setState({open: false})
    }

    const dialogActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={onCancel}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onTouchTap={onCreate}
      />,
    ]

    return (
      <div style={style}>
        <RaisedButton label='Add new cookbook' icon={<AddIcon/>} onMouseUp={() => this.setState({open: true})}/>
        <Dialog title="Create a new cookbook"
          modal={false}
          actions={dialogActions}
          open={this.state.open}>
          <TextField ref='name' hintText='Enter a cookbook name' onChange={(_, v) => this.setState({name: v})}/>
        </Dialog>
      </div>
    )
  }
}

class CookbookList extends Component {
  constructor(props, context) {
    super(props, context)
  }

  componentWillMount() {
    const {actions} = this.props
    actions.list()
  }

  render() {
    const {actions} = this.props
    const {cookbooks, message} = this.props.cookbooks

    const onCreateCookbook = (content) => {
      actions.create(content)
      actions.list()
    }

    const onDeleteCookbook = (id) => {
      actions.remove(id)
      actions.list()
    }

    const onBrew = (id) => {
      actions.brew(id)
    }

    let display
    if (Array.isArray(cookbooks)) {
      display = 
        <div>
          {
            cookbooks.map(
              (cookbook, i) => {
                return (
                  <CookbookCard
                    key={cookbook._id}
                    title={cookbook.name}
                    subtitle=''
                    href={`/editor/${cookbook._id}`}
                    onBrew={() => onBrew(cookbook._id)}
                    onDelete={() => onDeleteCookbook(cookbook._id)}
                  />)}
            )
          }
          <CookbookDialog style={{'paddingTop': '20px'}} onCreateCookbook={onCreateCookbook}/>
        </div>
    } else {
      display = <div>{message}</div>
    }

    return display
  }
}

CookbookList.propTypes = {
  actions: React.PropTypes.object,
  cookbooks: React.PropTypes.object
}

function mapStateToProps(state) {
  return {
    cookbooks: state.cookbooks
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(CookbookActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CookbookList)
