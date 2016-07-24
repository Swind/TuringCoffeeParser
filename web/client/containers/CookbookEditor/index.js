import React, { Component } from 'react'
import { Link } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Grid, Row, Col } from 'react-flexbox-grid'

import Divider from 'material-ui/Divider'
import FontIcon from 'material-ui/FontIcon'
import Paper from 'material-ui/Paper'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import Snackbar from 'material-ui/Snackbar';

import AddIcon from 'material-ui/svg-icons/content/add'

import { PROCESS } from '../../constants/processes'
import * as CookbookActions from '../../actions/cookbooks'
import Step from '../../components/Step'
import style from './style.css'

import CookbookHeader from './cookbookHeader'
import CookbookProcessParameter from './cookbookProcessParameter'
import CookbookMenu from './cookbookMenu'

class SelectProcess extends Component {
  render() {
    const {selected, onChange} = this.props

    const processMenuItems = Object.keys(PROCESS).map((k, i) => {
      return <MenuItem key={i} value={k} primaryText={k}/>
    })

    const onChangeWrapper = (_, index, value) => onChange(value)

    return (
      <SelectField value={selected} onChange={onChangeWrapper}>
        {processMenuItems}
      </SelectField>
    )
  }
}

class CookbookEditor extends Component {

  calcMenuTop() {
    return (window.scrollY) + 'px'
  }

  onScroll() {
    if (this.refs.menu) {
      this.refs.menu.style.top = this.calcMenuTop()
    }
  }

  componentWillMount() {
    const {params, actions} = this.props
    actions.load(params.cookbookId)
  }

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll.bind(this))
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll.bind(this))
  }

  render () {
    const {params, editor, actions} = this.props
    const cookbook = editor.cookbook

    if (!cookbook) {
      return <div></div>
    }

    const onAddProcess = () => {
      let clone = Object.assign({}, cookbook)
      clone.processes.push(Object.assign({}, PROCESS['spiral'].handle.default))
      actions.modify(clone)
    }

    const onCookbookChange = (cookbook) => {
      actions.modify(cookbook)
    }

    const onSaveCookbook = () => {
      let clone = Object.assign({}, cookbook)
      delete clone._id
      actions.save(params.cookbookId, clone)
    }

    const processes = cookbook.processes.map((x, i) => {

      const processHandle = new PROCESS[x.name].handle(x)

      const onSelectedProcessChange = (selected) => {
        let clone = Object.assign({}, cookbook)
        clone.processes[i] = Object.assign({}, PROCESS[selected].handle.default)
        actions.modify(clone)
      }

      const onModifyProcess = (params) => {
        let clone = Object.assign({}, cookbook)
        clone.processes[i] = Object.assign({}, params)
        actions.modify(clone)
      }

      const onDeleteStep = () => {
        let clone = Object.assign({}, cookbook)
        clone.processes.splice(i, 1)
        actions.modify(clone)
      const onInsertBeforeProcess = () => {
        // let clone = Object.assign({}, cookbook)
        cookbook.processes.splice(i, 0, Object.assign({}, PROCESS['spiral'].handle.default))
        actions.modify(cookbook)
      }

      const selectProcess = (
        <SelectProcess
          selected={x.name}
          onChange={onSelectedProcessChange}
        />
      )

      return (
        <div>
          <FloatingActionButton secondary={true} onMouseUp={onInsertBeforeProcess}>
            <AddIcon />
          </FloatingActionButton>
          <Step key={i} id={i+1} title={selectProcess} onDelete={onDeleteStep}>
            <CookbookProcessParameter params={processHandle.params} onModify={onModifyProcess}/>
          </Step>
        </div>
      )
    })

    return (
      <div>
        <Grid>
          <Row>
            <Col xs={10} xsOffset={1} >
              <div key='Paper'>
                <Paper className={style.Paper} zDepth={1}>
                  <CookbookHeader cookbook={cookbook} onChange={onCookbookChange}/>
                  <Divider />
                  {processes}
                  <FloatingActionButton secondary={true} onMouseUp={onAddProcess}>
                    <AddIcon />
                  </FloatingActionButton>
                </Paper>
              </div>
            </Col>
            <Col style={{'position': 'relative'}} xs={1}>
              <div key='Menu' style={{'position': 'absolute', 'top': this.calcMenuTop()}} ref='menu'>
                <CookbookMenu onSaveCookbook={onSaveCookbook}/>
              </div>
            </Col>
          </Row>
        </Grid>
        <Snackbar
          open={editor.openSave}
          message={editor.message}
          autoHideDuration={4000}
        />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    editor: state.editor
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(CookbookActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CookbookEditor)
