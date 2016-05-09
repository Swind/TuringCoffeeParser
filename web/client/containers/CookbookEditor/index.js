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

import TimerIcon from 'material-ui/svg-icons/image/timer'
import LocalDrinkIcon from 'material-ui/svg-icons/maps/local-drink'

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
    let highStart, highEnd, totalWater, totalTime

    if(process.high) {
      highStart =
        <li>
          <span>{`Z: ${process.high.start} mm`}</span>
          <Slider step={5} min={0} max={300} value={process.high.start}/>
        </li>
    }

    if (process.totalWater) {
      totalWater =
        <li>
          <span>{`Total Water: ${process.totalWater} ml`}</span>
          <Slider step={10} min={0} max={300} value={process.totalWater}/>
        </li>
    }

    if (process.totalTime) {
      totalTime =
        <li>
          <span>{`Total time: ${process.totalWater} sec.`}</span>
        </li>
    }

    return (
      <div>
        <ul>
          {highStart}
          {highEnd}
          {totalWater}
          {totalTime}
        </ul>
      </div>
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

    return (
      <WidthReactGridLayout className='layout' layout={layout} cols={12}>
        <Paper className={style.Paper} key='Paper' zDepth={1}>
          <CookbookHeader
            cookbook={cookbook}
          />
          <Divider />
          {
            cookbook.processes.map((x, i) =>
              <Step key={i} id={i+1} title={x.name}>
                <CookbookProcess process={x}/>
              </Step>
            )
          }
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
