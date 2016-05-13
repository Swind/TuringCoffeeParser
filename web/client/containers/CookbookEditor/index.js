import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ReactGridLayout, { WidthProvider } from 'react-grid-layout'

import Avatar from 'material-ui/Avatar'
import Divider from 'material-ui/Divider'
import FontIcon from 'material-ui/FontIcon'
import List from 'material-ui/List/List'
import ListItem from 'material-ui/List/ListItem'
import Paper from 'material-ui/Paper'
import TextField from 'material-ui/TextField'
import Slider from 'material-ui/Slider'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'

import TimerIcon from 'material-ui/svg-icons/image/timer'
import LocalDrinkIcon from 'material-ui/svg-icons/maps/local-drink'

import { PROCESS } from '../../constants/processes'
import * as CookbookActions from '../../actions/cookbooks'
import Step from '../../components/Step'
import style from './style.css'

const WidthReactGridLayout = WidthProvider(ReactGridLayout)

const layout = [
  {i: "Paper", x: 2, y: 0, w: 8, isDraggable: false, isResizable: false}
]

class CookbookHeader extends Component {
  render () {
    const {cookbook} = this.props
    return (
      <div>
        <TextField
          style={{"width": "100%"}}
          required={true}
          floatingLabel={true}
          floatingLabelText='Title'
          value={cookbook.name}
        />
        <TextField
          style={{"width": "100%"}}
          required={true}
          floatingLabel={true}
          floatingLabelText='Description'
          value={cookbook.description}
        />
        <List>
          <ListItem
            disabled={true}
            leftAvatar={
              <Avatar icon={<TimerIcon/>}/>
            }
          >
            {0}
          </ListItem>
          <ListItem
            disabled={true}
            leftAvatar={
              <Avatar icon={<LocalDrinkIcon/>}/>
            }
          >
            {0}
          </ListItem>
        </List>
      </div>
    )
  }
}

class CookbookProcess extends Component {
  render() {
    const {process} = this.props
    let high, totalWater, totalTime

    if(process.params.high !== undefined) {
      high=
        <li>
          <span>{`Z: from ${process.params.high.start} to ${process.params.high.end} mm`}</span>
          <Slider step={5} min={0} max={300} value={process.params.high.start}/>
          <Slider step={5} min={0} max={300} value={process.params.high.end}/>
        </li>
    }

    if (process.params.total_water !== undefined) {
      totalWater =
        <li>
          <span>{`Total Water: ${process.params.total_water} ml`}</span>
          <Slider step={10} min={0} max={500} value={process.params.total_water}/>
        </li>
    }

    if (process.params.total_time !== undefined) {
      totalTime =
        <li>
          <span>{`Total time: ${process.params.total_time} sec.`}</span>
        </li>
    }

    return (
      <div>
        <ul>
          {high}
          {totalWater}
          {totalTime}
        </ul>
      </div>
    )
  }
}

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

  componentWillMount() {
    const {params, actions} = this.props
    actions.load(params.cookbookId)
  }

  render () {
    const {params, editor, actions} = this.props
    const cookbook = editor.cookbook
    const id = params.cookbookId

    if (!cookbook) {
      return <div></div>
    }

    const processes = cookbook.processes.map((x, i) => {

      const processHandle = new PROCESS[x.name].handle(x)

      const onSelectedProcessChange = (selected) => {
        const clone = Object.assign({}, cookbook)
        clone.processes[i] = Object.assign({}, PROCESS[selected].handle.default)
        actions.modify(clone)
      }

      const selectProcess = (
        <SelectProcess
          selected={x.name}
          onChange={onSelectedProcessChange}
        />
      )

      return (
        <Step key={i} id={i+1} title={selectProcess}>
          <CookbookProcess process={processHandle}/>
        </Step>
      )
    })

    return (
      <WidthReactGridLayout className='layout' layout={layout} cols={12}>
        <Paper className={style.Paper} key='Paper' zDepth={1}>
          <CookbookHeader
            cookbook={cookbook}
          />
          <Divider />
          {processes}
        </Paper>
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
