import React, { Component } from 'react'
import Chart from 'chart.js'

Chart.defaults.global.maintainAspectRatio = false

export class LineChart extends Component {

  constructor() {
    super()
    this.state = {chart: null}
    this.attr = {
      type: 'line',
      options: {
        elements: {
          point: {
            radius: 2
          }
        },
        scales: {
          xAxes: [{
            display: false,
            showLines: false
          }]
        }
      }
    }
  }

  componentWillReceiveProps(next) {
    const { data } = next
    let chart = this.state.chart
    chart.data.datasets = data.datasets
    chart.data.labels = data.labels
    chart.update(0, true)
  }

  componentDidMount() {
    const ctx = this.refs.linechart
    this.state.chart = new Chart(ctx, this.attr)
  }

  componentWillUnmount() {
    const chart = this.state.chart
    chart.destroy()
  }

  render() {
    return (
      <div height={300} width={200}>
        <canvas ref="linechart" height={300} width={200}>
        </canvas>
      </div>
    )
  }
}
