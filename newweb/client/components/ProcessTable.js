import React, { Component } from 'react'
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table'

import FlatButton from 'material-ui/FlatButton'
import EditorIcon from 'material-ui/svg-icons/editor/mode-edit'
import DeleteIcon from 'material-ui/svg-icons/action/delete'

class ProcessTable extends Component {

  createProcessRow(key, process) {

    const onDrag = (e) => {
      e.dataTransfer.setData('index', key)
    }

    const onDragOver = (e) => {
      e.preventDefault()
      e.dataTransfer.dropEffect = "move"
    }

    const onDrop = (e) => {
      e.preventDefault()

      const { onMoveProcess } = this.props
      const from = e.dataTransfer.getData('index')
      onMoveProcess(from, key)
    }

    const onTouchStart = (e) => {
    }

    const onTouchMove = (e) => {

    }

    const onTouchEnd = (e) => {
    }

    const onEdit = () => {
      const { onEditProcess } = this.props
      onEditProcess(key, process)
    }

    const onRemove = () => {
      const { onRemoveProcess } = this.props
      onRemoveProcess(key, process)
    }

    return (
      <TableRow key={key}
        onDragStart={onDrag}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        draggable={true}
        selectable={false}
        style={{cursor: 'pointer'}}>
        <TableRowColumn>
          {process.params.name}
        </TableRowColumn>
        <TableRowColumn>
          {(process.water !== undefined)? process.water.toFixed() + ' ml': ''}
        </TableRowColumn>
        <TableRowColumn>
          {(process.time !== undefined)? process.time.toFixed() + ' sec.': ''}
        </TableRowColumn>
        <TableRowColumn>
          {(process.params.temperature !== undefined)? process.params.temperature + ' ℃': ''}
        </TableRowColumn>
        <TableRowColumn>
          <FlatButton icon={<EditorIcon/>} onTouchTap={onEdit} />
          <FlatButton icon={<DeleteIcon/>} onTouchTap={onRemove} />
        </TableRowColumn>
      </TableRow>
    )
  }

  render() {

    const { processes } = this.props
    const processRows = processes.map((v, i) => this.createProcessRow(i, v))

    return (
      <Table>
        <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
          <TableRow>
            <TableHeaderColumn>Name</TableHeaderColumn>
            <TableHeaderColumn>Water</TableHeaderColumn>
            <TableHeaderColumn>Time</TableHeaderColumn>
            <TableHeaderColumn>Temperature</TableHeaderColumn>
            <TableHeaderColumn>Actions</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {processRows}
        </TableBody>
      </Table>
    )
  }
}

export default ProcessTable
