import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import ReactGridLayout, { WidthProvider } from 'react-grid-layout'

import IconButton from 'material-ui/IconButton'
import AddIcon from 'material-ui/svg-icons/content/add'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

import CookbookCard from '../../components/CookbookCard';
import * as CookbookActions from '../../actions/cookbooks'

const WidthReactGridLayout = WidthProvider(ReactGridLayout)

const layout = [
  {i: 'Card', x: 0, y: 0, w:12, h:1, isDraggable: false, isResizable: false}
];

class CookbookDialog extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = {open: false}
  }

  render() {

    const {onCreateCookbook} = this.props

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
      <div>
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
    super(props, context);
  }

  componentWillMount() {
    const {actions} = this.props
    actions.list()
  }

  render() {
    const {actions} = this.props
    const {cookbooks} = this.props.cookbooks

    const onCreateCookbook = (content) => {
      actions.create(content)
      actions.list()
    }

    return (
      <WidthReactGridLayout className='layout' layout={layout} cols={12}>
        <div key='Card'>
          {
            cookbooks.map(
              (cookbook, i) => {
                return (
                  <CookbookCard
                    key={i}
                    title={cookbook.name}
                    subtitle=''
                    href={`/editor/${cookbook._id}`}
                  />)}
            )
          }
          <CookbookDialog onCreateCookbook={onCreateCookbook}/>
        </div>
      </WidthReactGridLayout>
    );
  }
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
