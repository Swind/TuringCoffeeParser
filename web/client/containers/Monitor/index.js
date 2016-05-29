import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import TimeSeriesChart from '../../components/TimeSeriesChart'

import InfoCard from '../../components/InfoCard'
import * as HeaterAction from '../../actions/heater'

const tankTemperatureColor = 'rgba(33, 150, 243, 0.5)'
const dutyCycleColor = 'rgba(244, 67, 54, 0.5)'
const setPointColor = 'rgba(255, 152, 0, 0.5)'

class Monitor extends Component {

  constructor(props) {
    super(props)
    this.state = {}
    this.state.tankTemperatures = []
    this.state.dutyCycles = []
    this.state.setPoints = []
    this.state.labels = []
  }

  componentDidMount() {
    const {actions} = this.props
    actions.getHeaterStatus()
    const h = setInterval(() => {actions.getHeaterStatus()}, 1000)
    this.setState({handle: h})
  }

  componentWillUnmount() {
    clearInterval(this.state.handle)
    this.setState({})
  }

  componentWillReceiveProps(next) {
    const {monitor} = next
    let state = this.state
    state.tankTemperatures.push(monitor.tankTemperature)
    state.dutyCycles.push(monitor.dutyCycle)
    state.setPoints.push(monitor.setPoint)
    state.labels.push('')

    if (state.tankTemperatures.length > 600) {
      state.tankTemperatures.shift()
      state.dutyCycles.shift()
      state.setPoints.shift()
      state.labels.shift()
    }

    this.setState(state)
  }

  render() {
    const {actions, monitor} = this.props

    if (this.state.tankTemperatures.length === 0) {
      return <div></div>
    }

    const datasets = [
      {
        label: 'Tank Temperature',
        fill: false,
        backgroundColor: tankTemperatureColor,
        borderColor: tankTemperatureColor,
        data: this.state.tankTemperatures
      },
      {
        label: 'Set Point',
        fill: false,
        backgroundColor: setPointColor,
        borderColor: setPointColor,
        data: this.state.setPoints
      },
      {
        label: 'Duty Cycle',
        fill: false,
        backgroundColor: dutyCycleColor,
        borderColor: dutyCycleColor,
        data: this.state.dutyCycles
      }
    ]

    return (
      <div style={{'height': '300px'}}>
        <TimeSeriesChart labels={this.state.labels} datasets={datasets}/>
        <InfoCard title="Tank temp." color={tankTemperatureColor}>
          {monitor.tankTemperature.toFixed(3) + '℃'}
        </InfoCard>
        <InfoCard title="Set point" color={setPointColor}>
          {monitor.setPoint.toFixed(3) + '℃'}
        </InfoCard>
        <InfoCard title="Duty cycle" color={dutyCycleColor}>
          {monitor.dutyCycle.toFixed(3) + '%'}
        </InfoCard>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    monitor: state.monitor
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(HeaterAction, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Monitor)
