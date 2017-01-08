import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Col } from 'react-flexbox-grid/lib'

import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'

import { getHeater, setTargetPoint } from '../actions/heater'
import { LineChart } from '../components/Chart'
import { PairTable } from '../components/PairTable'

class BaristaMonitor extends Component {

  componentDidMount() {
    const h = setInterval(() => {this.props.dispatch(getHeater.request())}, 1000)
    this.setState({handle: h})
  }

  componentWillUnmount() {
    clearInterval(this.state.handle)
    this.setState({})
  }

  prepareChartData() {
    const { labels, tankTemperatures, dutyCycles, outputTemperatures, setPoints } = this.props.monitor

    return {
      labels: labels,
      datasets: [
        {
          label: 'Tank Temperature',
          data: tankTemperatures,
          borderColor: '#00BCD4',
          backgroundColor: 'rgba(0,0,0,0)',
          lineTension: 0
        },
        {
          label: 'Duty Cycle',
          data: dutyCycles,
          borderColor: '#E91E63',
          backgroundColor: 'rgba(0,0,0,0)',
          lineTension: 0
        },
        {
          label: 'Output Temperature',
          data: outputTemperatures,
          borderColor: '#673AB7',
          backgroundColor: 'rgba(0,0,0,0)',
          lineTension: 0
        },
        {
          label: 'Set Point',
          data: setPoints,
          borderColor: '#F44336',
          backgroundColor: 'rgba(0,0,0,0)',
          lineTension: 0
        }
      ]
    }
  }

  setTargetPoint() {
    const temp = this.refs.setpoint.input.value
    this.props.dispatch(setTargetPoint.request(parseInt(temp)))
  }

  getLastValue = (array) => array[array.length - 1]

  render() {
    const { labels, tankTemperatures, dutyCycles, outputTemperatures, setPoints } = this.props.monitor

    const pairs = [
      { key: 'Tank Temperature', value: this.getLastValue(tankTemperatures) },
      { key: 'Duty Cycles', value: this.getLastValue(dutyCycles) },
      { key: 'Output Temperature', value: this.getLastValue(outputTemperatures) },
      { key: 'Target Temperature', value: this.getLastValue(setPoints) }
    ]

    return (
      <div>
        <Grid fluid={true}>
          <Row start="xs">
            <Col xs={12} sm={8} md={6} lg={6}>
              <LineChart data={this.prepareChartData()}/>
            </Col>
            <Col xs={12} sm={4} md={6} lg={6}>
              <PairTable pairs={pairs}/>
              <TextField hintText="Set point" type="number" ref="setpoint" />
              <FlatButton label="Apply" primary={true} onTouchTap={this.setTargetPoint.bind(this)}/>
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    monitor: state.monitor
  }
}

export default connect(
  mapStateToProps
)(BaristaMonitor)
