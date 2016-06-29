import React, { Component } from 'react'
import { Link } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ReactGridLayout, { WidthProvider } from 'react-grid-layout'

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

const WidthReactGridLayout = WidthProvider(ReactGridLayout)

const layout = [
  {i: "Paper", x: 4, y: 0, w: 16, isDraggable: false, isResizable: false},
]

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

  calcMenuLeft() {
    return (window.innerWidth/24 * 16) + 'px'
  }

  calcMenutop() {
    return (window.scrollY) + 'px'
  }

  onScroll() {
    if (this.refs.menu) {
      this.refs.menu.style.left = this.calcMenuLeft()
      this.refs.menu.style.top = this.calcMenutop()
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
      }

      const selectProcess = (
        <SelectProcess
          selected={x.name}
          onChange={onSelectedProcessChange}
        />
      )

      return (
        <Step key={i} id={i+1} title={selectProcess} onDelete={onDeleteStep}>
          <CookbookProcessParameter params={processHandle.params} onModify={onModifyProcess}/>
        </Step>
      )
    })

    return (
      <WidthReactGridLayout className='layout' layout={layout} cols={24}>
        <div key='Paper'>
          <Paper className={style.Paper} zDepth={1}>
            <CookbookHeader cookbook={cookbook} />
            <Divider />
            {processes}
            <FloatingActionButton secondary={true} onMouseUp={onAddProcess}>
              <AddIcon />
            </FloatingActionButton>
          </Paper>
          <div key='Menu' style={{'position': 'fixed', 'left': this.calcMenuLeft(), 'top': this.calcMenutop()}} ref='menu'>
            <CookbookMenu onSaveCookbook={onSaveCookbook}/>
          </div>
          <Snackbar
            open={editor.openSave}
            message={editor.message}
            autoHideDuration={4000}
          />
        </div>
      </WidthReactGridLayout>
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
