import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'

import { getCookbook, saveCookbook } from '../actions/cookbook'
import { openEditor, closeEditor, closeSaveEditor, removeProcess, saveProcess, appendProcess, closeSnackbar, editNewProcess, changeCookbookName, changeCookbookDescription, moveProcess } from '../actions/editor'

import Process from 'processes/process'
import SpiralTotalWater from 'processes/spiral-total-water'

import ProcessTable from '../components/ProcessTable'
import CookbookInformation from '../components/CookbookInformation'
import ProcessEditorDialog from '../components/ProcessEditorDialog'

import Divider from 'material-ui/Divider'
import RaisedButton from 'material-ui/RaisedButton'
import Snackbar from 'material-ui/Snackbar'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import ContentSave from 'material-ui/svg-icons/content/save'
import ActionExit from 'material-ui/svg-icons/action/exit-to-app'

class CookbookEditor extends Component {

  componentDidMount() {
    this.props.dispatch(
      getCookbook.request(this.props.params.cookbookId)
    )
  }

  loadingRender() {
    return (
      <div>Loading cookbook content ...</div>
    )
  }

  openProcessEditor(index, process) {
    this.props.dispatch(openEditor(index, process))
  }

  closeSaveProcessEditor(index, process) {
    this.props.dispatch(closeSaveEditor(index, process))
  }

  closeProcessEditor(index, process) {
    this.props.dispatch(closeEditor(index, process))
  }

  saveEditProcess(process) {
    this.props.dispatch(saveProcess(process))
  }

  onSnackbarClose() {
    this.props.dispatch(closeSnackbar())
  }

  onSaveCookbook() {
    const cookbook = this.props.editor.cookbook
    this.props.dispatch(saveCookbook.request(cookbook._id, cookbook))
  }

  onCookbookNameChange(name) {
    this.props.dispatch(changeCookbookName(name))
  }

  onCookbookDescriptionChange(desc) {
    this.props.dispatch(changeCookbookDescription(desc))
  }

  onBack() {
    this.props.dispatch(push('/'))
  }

  onEditNewProcess() {
    const process = Object.assign({}, SpiralTotalWater.default)
    this.props.dispatch(editNewProcess(process))
  }

  removeProcess(index, process) {
    this.props.dispatch(removeProcess(index, process))
  }

  moveProcess(from, to) {
    this.props.dispatch(moveProcess(from, to))
  }

  loadedRender() {
    const { name, description, processes } = this.props.editor.cookbook
    const { editorOpen, editProcess } = this.props.editor
    const { saveOpen, saveResult } = this.props.editor
    const processWraps = processes.map((v) => Process.createProcess(v))

    return (
      <div>
        <CookbookInformation
          name={name}
          description={description}
          onNameChange={this.onCookbookNameChange.bind(this)}
          onDescriptionChange={this.onCookbookDescriptionChange.bind(this)}
        />
        <ProcessTable
          processes={processWraps}
          onEditProcess={this.openProcessEditor.bind(this)}
          onRemoveProcess={this.removeProcess.bind(this)}
          onMoveProcess={this.moveProcess.bind(this)}
        />
        <div
          style={{
            height: '100px',
            width: '100%'
          }}
        >
        </div>
        <div
          style={{
            position: 'fixed',
            right: '50px',
            bottom: '50px',
          }}
        >
          <FloatingActionButton
            onTouchTap={this.onEditNewProcess.bind(this)}
          >
            <ContentAdd />
          </FloatingActionButton>
          <FloatingActionButton
            onTouchTap={this.onSaveCookbook.bind(this)}
          >
            <ContentSave />
          </FloatingActionButton>
          <FloatingActionButton
            onTouchTap={this.onBack.bind(this)}
          >
            <ActionExit />
          </FloatingActionButton>
        </div>
        <ProcessEditorDialog
          open={editorOpen}
          onSubmit={this.closeSaveProcessEditor.bind(this)}
          onCancel={this.closeProcessEditor.bind(this)}
          onChange={this.saveEditProcess.bind(this)}
          process={editProcess}
        />
        <Snackbar open={saveOpen} message={saveResult} autoHideDuration={4000} onRequestClose={this.onSnackbarClose.bind(this)}/>

      </div>
    )
  }

  render() {
    const { loading } = this.props.editor
    if (loading) {
      return this.loadingRender()
    } else {
      return this.loadedRender()
    }
  }
}

function mapStateToProps(state) {
  return {
    editor: state.editor
  }
}

export default connect(
  mapStateToProps
)(CookbookEditor)
