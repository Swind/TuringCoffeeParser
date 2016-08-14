import React, { Component } from 'react'

import Slider from 'material-ui/Slider'
import TextField from 'material-ui/TextField'

class SliderWithText extends Component {

  componentWillMount() {
    const {value} = this.props
    this.setState({value})
  }

  componentWillReceiveProps(nextProps) {
    const {value} = nextProps
    this.setState({value})
  }

  onChange(_, v) {
    let value = this.state.value
    value = parseInt(v)
    this.setState({value})
  }

  onBlur() {
    const {onChange} = this.props
    onChange(this.state.value)
  }

  render() {
    const {step, min, max, prefix, suffix} = this.props
    const {value} = this.state

    const slider = <Slider
        step={step} min={min} max={max} value={value}
        onChange={this.onChange.bind(this)}
        onDragStop={this.onBlur.bind(this)}
      />
    const text = <TextField
        style={{width: '80px'}}
        id={'textfield'} type='number' value={value}
        inputStyle={{'textAlign': 'center'}}
        onChange={this.onChange.bind(this)}
        onBlur={this.onBlur.bind(this)}
      />

    return (
      <div style={{display: 'flex', alignItem: 'baseline'}}>
        <div style={{width: '80%'}}>
          {slider}
        </div>
        <div style={{width: '20%', 'paddingLeft': '10px'}}>
          {text}
        </div>
      </div>
    )
  }
}

class CoordinatesParameter extends Component {

  onXChange(v) {
    let {value} = this.props
    const {onChange} = this.props
    value.x = v
    onChange(value)
  }

  onYChange(v) {
    let {value} = this.props
    const {onChange} = this.props
    value.y = v
    onChange(value)
  }

  render() {
    const {step, min, max, title, value} = this.props
    return (
      <li>
        <span>{title}</span>
        <SliderWithText step={step} min={min} max={max} value={value.x} onChange={this.onXChange.bind(this)}/>
        <SliderWithText step={step} min={min} max={max} value={value.y} onChange={this.onYChange.bind(this)}/>
      </li>
    )
  }
}

class RangeParameter extends Component {

  onStartChange(v) {
    let {value} = this.props
    const {onChange} = this.props
    value.start = v
    onChange(value)
  }

  onEndChange(v) {
    let {value} = this.props
    const {onChange} = this.props
    value.end = v
    onChange(value)
  }

  render() {
    const {step, min, max, prefix, suffix, value} = this.props

    const start = (value.start !== undefined)?
      <SliderWithText
        step={step} min={min} max={max} value={value.start}
        onChange={this.onStartChange.bind(this)}/>: null

    const end = (value.end !== undefined)?
      <SliderWithText
        step={step} min={min} max={max} value={value.end}
        onChange={this.onEndChange.bind(this)}/>: null

    const title = prefix

    return (
      <li>
        <span>{title}</span>
        {start}
        {end}
      </li>
    )
  }
}

class SlideParameter extends Component {

  onChange(v) {
    const {onChange} = this.props
    onChange(v)
  }

  render() {
    const {step, min, max, title, value} = this.props
    return (
      <li>
        <span>{title}</span>
        <SliderWithText step={step} min={min} max={max} value={value} onChange={this.onChange.bind(this)}/>
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
          title: '(x, y)',
          min: -100,
          max: 100,
          step: 1
        }
      },
      {
        name: 'high',
        component: {
          type: 'range',
          prefix: 'High (mm)',
          suffix: '',
          min: 0,
          max: 300,
          step: 5
        }
      },
      {
        name: 'radius',
        component: {
          type: 'range',
          prefix: 'Radius (mm)',
          suffix: '',
          min: 0,
          max: 50,
          step: 1
        }
      },
      {
        name: 'total_water',
        component: {
          type: 'slider',
          title: 'Total water (ml)',
          min: 0,
          max: 300,
          step: 5
        }
      },
      {
        name: 'temperature',
        component: {
          type: 'slider',
          title: 'Temperature (°C)',
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
          title: 'Feedrate (ml)',
          min: 0,
          max: 1000,
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
