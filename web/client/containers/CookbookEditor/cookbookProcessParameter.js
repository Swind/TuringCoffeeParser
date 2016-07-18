import React, { Component } from 'react'

import Slider from 'material-ui/Slider'
import TextField from 'material-ui/TextField'

class CoordinatesParameter extends Component {

  onXChange(_, v) {
    let value = this.state.value
    value.x = v
    this.setState({value})
  }

  onYChange(_, v) {
    let value = this.state.value
    value.y = v
    this.setState({value})
  }

  onDragStop() {
    const {onChange} = this.props
    onChange(this.state.value)
  }

  componentWillMount() {
    const {value} = this.props
    this.setState({value})
  }

  componentWillReceiveProps(nextProps) {
    const {value} = nextProps
    this.setState({value})
  }

  render() {
    const {step, min, max, title} = this.props
    const {value} = this.state
    return (
      <li>
        <span>{title(value)}</span>
        <Slider step={step} min={min} max={max} value={value.x} onChange={this.onXChange.bind(this)} onDragStop={this.onDragStop.bind(this)}/>
        <Slider step={step} min={min} max={max} value={value.y} onChange={this.onYChange.bind(this)} onDragStop={this.onDragStop.bind(this)}/>
      </li>
    )
  }
}

class RangeParameter extends Component {

  onStartChange(_, v) {
    let value = this.state.value
    value.start = v
    this.setState({value})
  }

  onEndChange(_, v) {
    let value = this.state.value
    value.end = v
    this.setState({value})
  }

  onDragStop() {
    const {onChange} = this.props
    onChange(this.state.value)
  }

  componentWillMount() {
    const {value} = this.props
    this.setState({value})
  }

  componentWillReceiveProps(nextProps) {
    const {value} = nextProps
    this.setState({value})
  }

  render() {
    const {step, min, max, prefix, suffix} = this.props
    const {value} = this.state

    const startSlider = (value.start !== undefined)?
      <Slider
        step={step} min={min} max={max} value={value.start}
        onChange={this.onStartChange.bind(this)}
        onDragStop={this.onDragStop.bind(this)}/>: null

    const endSlider = (value.end !== undefined)?
      <Slider
        step={step} min={min} max={max} value={value.end}
        onChange={this.onEndChange.bind(this)}
        onDragStop={this.onDragStop.bind(this)}/>: null

    return (
      <li>
        <span>{prefix} from {value.start} to {value.end} {suffix}</span>
        {startSlider}
        {endSlider}
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
    onChange(parseFloat(v))
  }

  render() {
    const {prefix, suffix, type, value, onChange} = this.props
    return (
        <li>
          <span>{prefix}</span>
          <TextField id={'textfield'} type={type} value={value} inputStyle={{'textAlign': 'center'}} onChange={this.onValueChange.bind(this)}/>
          <span>{suffix}</span>
        </li>
    )
  }
}

class CookbookProcessParameter extends Component {

  static get PARAMETERS() {
    return [
      {
        name: 'coordinates',
        component: {
          type: 'coordinates',
          title: (v) => `(x, y) -> (${v.x}, ${v.y})`,
          min: -100,
          max: 100,
          step: 1
        }
      },
      {
        name: 'high',
        component: {
          type: 'range',
          prefix: 'High: ',
          suffix: 'mm',
          min: 0,
          max: 300,
          step: 5
        }
      },
      {
        name: 'radius',
        component: {
          type: 'range',
          prefix: 'Radius: ',
          suffix: 'mm',
          min: 0,
          max: 50,
          step: 1
        }
      },
      {
        name: 'total_water',
        component: {
          type: 'slider',
          title: (v) => `Total water: ${v} ml`,
          min: 0,
          max: 300,
          step: 5
        }
      },
      {
        name: 'temperature',
        component: {
          type: 'slider',
          title: (v) => `Temperature : ${v} °C`,
          min: 0,
          max: 100,
          step: 1,
        }
      },
      {
        name: 'total_time',
        component: {
          type: 'number',
          prefix: 'Total time: ',
          suffix: 'seconds'
        }
      },
      {
        name: 'cylinder',
        component: {
          type: 'number',
          prefix: 'Cylinder: ',
          suffix: ''
        }
      },
      {
        name: 'feedrate',
        component: {
          type: 'slider',
          title: (v) => `Feedrate: ${v} ml`,
          min: 0,
          max: 300,
          step: 5
        }
      },
    ]
  }

  componentWillMount() {
    const {params} = this.props
    this.setState({params: params})
  }

  componentWillReceiveProps(nextProps) {
    this.setState({params: nextProps.params})
  }

  render() {
    const {onModify} = this.props
    let totalWaterParameter, totalTimeParameter, radiusParameter,
      temperatureParameter, highParameter, cylinderParameter,
      feedrateParameter, xParameter, yParameter

    const onChange = () => {
      onModify(this.state.params)
    }

    const params = CookbookProcessParameter.PARAMETERS
    let parameters = []
    for (let i = 0; i < params.length; i++) {
      const p = params[i]
      if (!(p.name in this.props.params)) {
        continue
      }

      const c = p.component
      const onChange = (v) => {
        let cloneParams = Object.assign({}, this.props.params)
        cloneParams[p.name] = v
        onModify(cloneParams)
      }

      const value = this.props.params[p.name]
      switch(c.type) {
        case 'slider':
          parameters.push(<SlideParameter key={p.name} title={c.title} value={value} min={c.min} max={c.max} step={c.step} onChange={onChange}/>)
          break
        case 'number':
          parameters.push(<TextParameter key={p.name} type='number' prefix={c.prefix} suffix={c.suffix} value={value} onChange={onChange}/>)
          break
        case 'range':
          parameters.push(<RangeParameter key={p.name} prefix={c.prefix} suffix={c.suffix} value={value} min={c.min} max={c.max} step={c.step} onChange={onChange}/>)
          break
        case 'coordinates':
          parameters.push(<CoordinatesParameter key={p.name} title={c.title} value={value} min={c.min} max={c.max} step={c.step} onChange={onChange}/>)
          break
        default:
          console.log(`Unknown display type: ${c.type}`)
          break
      }
    }

    return (
      <div>
        <ul>
          {parameters}
        </ul>
      </div>
    )
  }
}

export default CookbookProcessParameter
