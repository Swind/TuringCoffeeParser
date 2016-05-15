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
import FloatingActionButton from 'material-ui/FloatingActionButton'
import IconButton from 'material-ui/IconButton'
import Snackbar from 'material-ui/Snackbar';

import TimerIcon from 'material-ui/svg-icons/image/timer'
import LocalDrinkIcon from 'material-ui/svg-icons/maps/local-drink'
import AddIcon from 'material-ui/svg-icons/content/add'
import SaveIcon from 'material-ui/svg-icons/content/save'

import { PROCESS } from '../../constants/processes'
import * as CookbookActions from '../../actions/cookbooks'
import Step from '../../components/Step'
import style from './style.css'

const WidthReactGridLayout = WidthProvider(ReactGridLayout)

const layout = [
  {i: "Paper", x: 4, y: 0, w: 16, isDraggable: false, isResizable: false},
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

class CookbookProcessParameter extends Component {

  componentWillMount() {
    const {params} = this.props
    this.setState({params: params})
  }

  componentWillReceiveProps(nextProps) {
    this.setState({params: nextProps.params})
  }

  render() {
    const {onModify} = this.props
    let high, totalWater, totalTime, radius

    const onChange = () => {
      onModify(this.state.params)
    }

    let cloneParams = Object.assign({}, this.state.params)
    const onHighStartChange = (_, v) => {
      cloneParams.high.start = v
      this.setState({params: cloneParams})
    }

    const onHighEndChange = (_, v) => {
      cloneParams.high.end = v
      this.setState({params: cloneParams})
    }

    const onTotalWaterChange = (_, v) => {
      cloneParams.total_water = v
      this.setState({params: cloneParams})
    }

    const onTotalTimeChange = (_, v) => {
      cloneParams.total_time = v
      this.setState({params: cloneParams})
    }

    const onRadiusStartChange = (_, v) => {
      cloneParams.radius.start = v
      this.setState({params: cloneParams})
    }

    const onRadiusEndChange = (_, v) => {
      cloneParams.radius.end = v
      this.setState({params: cloneParams})
    }

    if (this.state.params.radius !== undefined) {
      radius =
        <li>
          <span>{`Radius: from ${this.state.params.radius.start} to ${this.state.params.radius.end} mm`}</span>
          <Slider step={5} min={0} max={300} value={this.state.params.radius.start} onChange={onRadiusStartChange} onDragStop={onChange}/>
          <Slider step={5} min={0} max={300} value={this.state.params.radius.end} onChange={onRadiusEndChange} onDragStop={onChange}/>
        </li>
    }

    if (this.state.params.high !== undefined) {
      high=
        <li>
          <span>{`High: from ${this.state.params.high.start} to ${this.state.params.high.end} mm`}</span>
          <Slider step={5} min={0} max={300} value={this.state.params.high.start} onChange={onHighStartChange} onDragStop={onChange}/>
          <Slider step={5} min={0} max={300} value={this.state.params.high.end} onChange={onHighEndChange} onDragStop={onChange}/>
        </li>
    }

    if (this.state.params.total_water !== undefined) {
      totalWater =
        <li>
          <span>{`Total Water: ${this.state.params.total_water} ml`}</span>
          <Slider step={10} min={0} max={500} value={this.state.params.total_water} onChange={onTotalWaterChange} onDragStop={onChange}/>
        </li>
    }

    if (this.state.params.total_time !== undefined) {
      totalTime =
        <li>
          <span>Total time:</span>
          <TextField type="number" value={this.state.params.total_time} inputStyle={{'textAlign': 'center'}} onChange={onTotalTimeChange}/>
          <span>seconds</span>
        </li>
    }

    return (
      <div>
        <ul>
          {radius}
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

  componentDidMount() {
  }

  render () {
    const {params, editor, actions} = this.props
    const cookbook = editor.cookbook

    if (!cookbook) {
      return <div></div>
    }

    const calcMenuLeft = () => (window.innerWidth/24 * 16) + 'px'
    const calcMenutop = () => (window.scrollY) + 'px'

    window.addEventListener('scroll', () => {
      this.refs.menu.style.left = calcMenuLeft()
      this.refs.menu.style.top = calcMenutop()
    })

    const onAddProcess = () => {
      let clone = Object.assign({}, cookbook)
      clone.processes.push(Object.assign({}, PROCESS['spiral'].handle.default))
      actions.modify(clone)
    }

    const onSaveCookbook = () => {
      let clone = Object.assign({}, cookbook)
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

      const selectProcess = (
        <SelectProcess
          selected={x.name}
          onChange={onSelectedProcessChange}
        />
      )

      return (
        <Step key={i} id={i+1} title={selectProcess}>
          <CookbookProcessParameter params={processHandle.params} onModify={onModifyProcess}/>
        </Step>
      )
    })

    return (
      <WidthReactGridLayout className='layout' layout={layout} cols={24}>
        <div key='Paper'>
          <Paper className={style.Paper} zDepth={1}>
            <CookbookHeader
              cookbook={cookbook}
            />
            <Divider />
            {processes}
            <FloatingActionButton secondary={true} onMouseUp={onAddProcess}>
              <AddIcon />
            </FloatingActionButton>
          </Paper>
          <div key='Menu' style={{'position': 'fixed', 'left': calcMenuLeft(), 'top': calcMenutop()}} ref='menu'>
            <Paper zDepth={1}>
              <IconButton tooltip='Save' onMouseUp={onSaveCookbook}>
                <SaveIcon />
              </IconButton>
            </Paper>
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
