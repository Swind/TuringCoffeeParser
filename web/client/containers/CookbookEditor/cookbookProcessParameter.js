import React, { Component } from 'react'

import Slider from 'material-ui/Slider'
import TextField from 'material-ui/TextField'

class RangeParameter extends Component {

  onStartChange(_, v) {
    this.setState({start: v, end: this.state.end})
  }

  onEndChange(_, v) {
    this.setState({start: this.state.start, end: v})
  }

  onDragStop() {
    const {onChange} = this.props
    onChange(this.state.start, this.state.end)
  }

  componentWillMount() {
    const {start, end} = this.props
    this.setState({start: start, end: end})
  }

  componentWillReceiveProps(nextProps) {
    const {start, end} = nextProps
    this.setState({start: start, end: end})
  }

  render() {
    const {step, min, max, title} = this.props
    const {start, end} = this.state
    return (
      <li>
        <span>{title(start, end)}</span>
        <Slider step={step} min={min} max={max} value={start} onChange={this.onStartChange.bind(this)} onDragStop={this.onDragStop.bind(this)}/>
        <Slider step={step} min={min} max={max} value={end} onChange={this.onEndChange.bind(this)} onDragStop={this.onDragStop.bind(this)}/>
      </li>
    )
  }
}

class SlideParameter extends Component {

  onValueChange(_, v) {
    this.setState({value: v})
  }

  onDragStop() {
    const {onChange} = this.props
    onChange(this.state.value)
  }

  componentWillMount() {
    const {value} = this.props
    this.setState({value: value})
  }

  componentWillReceiveProps(nextProps) {
    const {value} = nextProps
    this.setState({value: value})
  }

  render() {
    const {step, min, max, title} = this.props
    const {value} = this.state
    return (
      <li>
        <span>{title(value)}</span>
        <Slider step={step} min={min} max={max} value={value} onChange={this.onValueChange.bind(this)} onDragStop={this.onDragStop.bind(this)}/>
      </li>
    )
  }
}

class TextParameter extends Component {

  onValueChange(_, v) {
    const {onChange} = this.props
    onChange(v)
  }

  render() {
    const {prefix, suffix, type, value, onChange} = this.props
    return (
        <li>
          <span>{prefix}</span>
          <TextField type={type} value={value} inputStyle={{'textAlign': 'center'}} onChange={this.onValueChange.bind(this)}/>
          <span>{suffix}</span>
        </li>
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
    let totalWaterParameter, totalTimeParameter, radiusParameter, temperatureParameter, highParameter, cylinderParameter

    const onChange = () => {
      onModify(this.state.params)
    }

    if (this.props.params.high !== undefined) {
      let {high} = this.props.params
      let title = (start, end) => `High: from ${start} to ${end} mm`
      let onHighChange = (start, end) => {
        let cloneParams = Object.assign({}, this.props.params)
        cloneParams.high.start = start
        cloneParams.high.end = end
        onModify(cloneParams)
      }
      highParameter = <RangeParameter title={title} start={high.start} end={high.end} min={0} max={300} step={5} onChange={onHighChange}/>
    }

    if (this.state.params.radius !== undefined) {
      if (this.state.params.radius.end !== undefined) {
        let {radius} = this.props.params
        let title = (start, end) => `Radius: from ${start} to ${end} mm`
        let onRadiusChange = (start, end) => {
          let cloneParams = Object.assign({}, this.props.params)
          cloneParams.radius.start = start
          cloneParams.radius.end = end
          onModify(cloneParams)
        }
        radiusParameter = <RangeParameter title={title} start={radius.start} end={radius.end} min={0} max={50} step={1} onChange={onRadiusChange}/>
      } else {
        let {radius} = this.props.params
        let title = (v) => `Radius: ${v} mm`
        let onRadiusChange = (v) => {
          let cloneParams = Object.assign({}, this.props.params)
          cloneParams.radius.start = v
          onModify(cloneParams)
        }
        radiusParameter = <SlideParameter title={title} value={radius.start} min={0} max={50} step={1} onChange={onRadiusChange}/>
      }
    }

    if (this.state.params.total_water !== undefined) {
      let {total_water} = this.props.params
      let title = (v) => `Total water: ${v} ml`
      let onTotalWaterChange = (v) => {
        let cloneParams = Object.assign({}, this.props.params)
        cloneParams.total_water = v
        onModify(cloneParams)
      }
      totalWaterParameter = <SlideParameter title={title} value={total_water} min={0} max={300} step={5} onChange={onTotalWaterChange}/>
    }

    if (this.state.params.temperature !== undefined) {
      let {temperature} = this.props.params
      let title = (v) => `Temperature: ${v} °C`
      let onTemperatureChange = (v) => {
        let cloneParams = Object.assign({}, this.props.params)
        cloneParams.temperature = v
        onModify(cloneParams)
      }
      temperatureParameter = <SlideParameter title={title} value={temperature} min={0} max={100} step={1} onChange={onTemperatureChange}/>
    }

    if (this.state.params.total_time !== undefined) {
      let {total_time} = this.props.params
      let prefix = 'Total time: '
      let suffix = 'seconds'
      let onTotalTimeChange = (v) => {
        let cloneParams = Object.assign({}, this.props.params)
        cloneParams.total_time= v
        onModify(cloneParams)
      }
      totalTimeParameter = <TextParameter prefix={prefix} suffix={suffix} value={total_time} onChange={onTotalTimeChange}/>
    }

    if (this.state.params.cylinder !== undefined) {
      let {cylinder} = this.props.params
      let prefix = 'Cylinder: '
      let suffix = ''
      let onCylinderChange = (v) => {
        let cloneParams = Object.assign({}, this.props.params)
        cloneParams.total_time= v
        onModify(cloneParams)
      }
      cylinderParameter = <TextParameter prefix={prefix} suffix={suffix} value={cylinder} onChange={onCylinderChange}/>
    }


    return (
      <div>
        <ul>
          {radiusParameter}
          {cylinderParameter}
          {highParameter}
          {totalWaterParameter}
          {temperatureParameter}
          {totalTimeParameter}
        </ul>
      </div>
    )
  }
}

export default CookbookProcessParameter
