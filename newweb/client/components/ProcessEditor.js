import React, { Component } from 'react'

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table'
import MenuItem from 'material-ui/MenuItem'
import DropDownMenu from 'material-ui/DropDownMenu'
import TextField from 'material-ui/TextField'

import Calibration from 'libs/processes/calibration'
import Circle from 'libs/processes/circle'
import FixedPoint from 'libs/processes/fixed-point'
import Home from 'libs/processes/home'
import Move from 'libs/processes/move'
import Spiral from 'libs/processes/spiral'
import SpiralTotalWater from 'libs/processes/spiral-total-water'
import Wait from 'libs/processes/wait'
import Mix from 'libs/processes/mix'

const processes = {
  'calibration': Calibration,
  'circle': Circle,
  'fixed_point': FixedPoint,
  'home': Home,
  'move': Move,
  'spiral': Spiral,
  'spiral total water': SpiralTotalWater,
  'wait': Wait,
  'mix': Mix
}

export default class ProcessEditor extends Component {

  createTextfieldEditor(field, onChange) {
    if (field === undefined) {
      return null
    }

    const fieldTextfield = <TextField
        style={{width: '80px'}}
        id={'textfield'} type='number' value={field}
        inputStyle={{'textAlign': 'center'}}
        onChange={onChange}
      />

    return fieldTextfield
  }

  createKeyValueRow(name, value) {
    if (value === undefined || value === null) {
      return null
    }

    return (
      <TableRow>
        <TableRowColumn>{name}</TableRowColumn>
        <TableRowColumn>{value}</TableRowColumn>
      </TableRow>
    )
  }

  onRadiusStartChange(_, v) {
    const { process, onChange } = this.props
    let copyProcess = Object.assign({}, process)
    copyProcess.radius.start = parseInt(v)
    onChange(copyProcess)
  }

  onRadiusEndChange(_, v) {
    const { process, onChange } = this.props
    let copyProcess = Object.assign({}, process)
    copyProcess.radius.end = parseInt(v)
    onChange(copyProcess)
  }

  createRadiusEditor(radius) {
    if (radius === undefined) {
      return null
    }

    return this.createKeyValueRow('Radius',
      <div>
        {this.createTextfieldEditor(radius.start, this.onRadiusStartChange.bind(this))}
        ->
        {this.createTextfieldEditor(radius.end, this.onRadiusEndChange.bind(this))}
        mm
      </div>)
  }

  onHighStartChange(_, v) {
    const { process, onChange } = this.props
    let copyProcess = Object.assign({}, process)
    copyProcess.high.start = parseInt(v)
    onChange(copyProcess)
  }

  onHighEndChange(_, v) {
    const { process, onChange } = this.props
    let copyProcess = Object.assign({}, process)
    copyProcess.high.end = parseInt(v)
    onChange(copyProcess)
  }

  createHighEditor(high) {
    if (high === undefined) {
      return null
    }
    return this.createKeyValueRow('High',
      <div>
        {this.createTextfieldEditor(high.start, this.onHighStartChange.bind(this))}
        {(high.end)? '->': ''}
        {this.createTextfieldEditor(high.end, this.onHighEndChange.bind(this))}
        mm
      </div>)
  }

  onWaterChange(_, v) {
    const { process, onChange } = this.props
    let copyProcess = Object.assign({}, process)
    copyProcess.total_water = parseInt(v)
    onChange(copyProcess)
  }

  createWaterEditor(water) {
    if (water === undefined) {
      return null
    }
    return this.createKeyValueRow('Water',
      <div>
        {this.createTextfieldEditor(water, this.onWaterChange.bind(this))}
        ml
      </div>)
  }

  onCylinderChange(_, v) {
    const { process, onChange } = this.props
    let copyProcess = Object.assign({}, process)
    copyProcess.cylinder = parseInt(v)
    onChange(copyProcess)
  }

  createCylinderEditor(cylinder) {
    if (cylinder === undefined) {
      return null
    }
    return this.createKeyValueRow('Cylinder',
      <div>
        {this.createTextfieldEditor(cylinder, this.onCylinderChange.bind(this))}
        turns
      </div>
    )
  }

  onTemperatureChange(_, v) {
    const { process, onChange } = this.props
    let copyProcess = Object.assign({}, process)
    copyProcess.temperature = parseInt(v)
    onChange(copyProcess)
  }

  createTemperatureEditor(temperature) {
    if (temperature === undefined) {
      return null
    }
    return this.createKeyValueRow('Temperature',
      <div>
        {this.createTextfieldEditor(temperature, this.onTemperatureChange.bind(this))}
        °C
      </div>)
  }

  onCoordinateXChange(_, v) {
    const { process, onChange } = this.props
    let copyProcess = Object.assign({}, process)
    copyProcess.coordinates.x = parseInt(v)
    onChange(copyProcess)
  }

  onCoordinateYChange(_, v) {
    const { process, onChange } = this.props
    let copyProcess = Object.assign({}, process)
    copyProcess.coordinates.y = parseInt(v)
    onChange(copyProcess)
  }

  createCoordinateEditor(coordinates) {
    if (coordinates === undefined) {
      return null
    }
    return this.createKeyValueRow('Coordinates',
      <div>
        {this.createTextfieldEditor(coordinates.x, this.onCoordinateXChange.bind(this))}
        {this.createTextfieldEditor(coordinates.y, this.onCoordinateYChange.bind(this))}
        mm
      </div>)
  }

  onFeedrateChange(_, v) {
    const { process, onChange } = this.props
    let copyProcess = Object.assign({}, process)
    copyProcess.feedrate= parseInt(v)
    onChange(copyProcess)
  }

  createFeedrateEditor(feedrate) {
    if (feedrate === undefined) {
      return null
    }
    return this.createKeyValueRow('Feedrate',
      <div>
        {this.createTextfieldEditor(feedrate, this.onFeedrateChange.bind(this))}
        mm/min
      </div>
    )
  }

  onTimeChange(_, v) {
    const { process, onChange } = this.props
    let copyProcess = Object.assign({}, process)
    copyProcess.total_time = parseInt(v)
    onChange(copyProcess)
  }

  createTimeEditor(time) {
    if (time === undefined) {
      return null
    }
    return this.createKeyValueRow('Time',
      <div>
        {this.createTextfieldEditor(time, this.onTimeChange.bind(this))}
        sec.
      </div>)
  }

  onProcessTypeChange(event, key, payload) {
    const { onChange } = this.props
    let newProcess = processes[payload].default
    onChange(newProcess)
  }

  render() {
    const { process } = this.props

    return (
      <div>
        <DropDownMenu value={process.name} onChange={this.onProcessTypeChange.bind(this)}>
          <MenuItem primaryText="Circle" value="circle"/>
          <MenuItem primaryText="Fixed Point" value="fixed_point"/>
          <MenuItem primaryText="Spiral" value="spiral"/>
          <MenuItem primaryText="Spiral Total Water" value="spiral total water"/>
          <MenuItem primaryText="Wait" value="wait"/>
          <MenuItem primaryText="Home" value="home"/>
          <MenuItem primaryText="Move" value="move"/>
          <MenuItem primaryText="Calibration" value="calibration"/>
          <MenuItem primaryText="Mix" value="mix"/>
        </DropDownMenu>
        <Table selectable={false}>
          <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn>Attribute</TableHeaderColumn>
              <TableHeaderColumn>Value</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {this.createWaterEditor(process.total_water)}
            {this.createTimeEditor(process.total_time)}
            {this.createTemperatureEditor(process.temperature)}
            {this.createHighEditor(process.high)}
            {this.createRadiusEditor(process.radius)}
            {this.createCylinderEditor(process.cylinder)}
            {this.createCoordinateEditor(process.coordinates)}
            {this.createFeedrateEditor(process.feedrate)}
          </TableBody>
        </Table>
      </div>
    )
  }
}
