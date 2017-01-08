import React, { Component } from 'react'
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table'

export class PairTable extends Component {

  render() {

    const pairRows = this.props.pairs.map((v) =>
      <TableRow key={v.key}>
        <TableRowColumn>
          {v.key}
        </TableRowColumn>
        <TableRowColumn>
          {v.value}
        </TableRowColumn>
      </TableRow>
    )

    return (
      <Table selectable={false}>
        <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
          <TableRow displayBorder={true}>
            <TableHeaderColumn>
              Name
            </TableHeaderColumn>
            <TableHeaderColumn>
              Value
            </TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody showRowHover={false} displayRowCheckbox={false}>
          { pairRows }
        </TableBody>
      </Table>
    )
  }
}
