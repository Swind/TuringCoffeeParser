import React, { Component } from 'react'

import Slider from 'material-ui/Slider'
import TextField from 'material-ui/TextField'

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

export default CookbookProcessParameter
