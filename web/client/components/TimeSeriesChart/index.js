import React, { Component } from 'react'
import Chart from 'chart.js'

class TimeSeriesChart extends Component {

  constructor(props) {
    super(props)
    this.state = {chart: null}
    Chart.defaults.global.maintainAspectRatio = false
  }

  componentDidMount() {
    const ctx = this.refs.canvass
    const {labels, datasets} = this.props

    const attr = {
      type: 'line',
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        elements: {
          point: {
            radius: 2
          }
        },
        xAxes: [{
          display: false
        }]
      }
    }

    this.state.chart = new Chart(ctx, attr)
  }

  componentWillReceiveProps(next) {
    const {labels, datasets} = next
    const chart = this.state.chart
    chart.data.datasets = datasets
    chart.data.labels = labels
    chart.update(0, true)
  }

  componentWillUnmount() {
    const chart = this.state.chart
    chart.destroy()
  }

  render() {
    return (
      <canvas ref="canvass">
      </canvas>
    )
  }
}

export default TimeSeriesChart
