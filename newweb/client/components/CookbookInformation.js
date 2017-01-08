import React, { Component } from 'react'
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index'

import EditorIcon from 'material-ui/svg-icons/editor/mode-edit'
import TextField from 'material-ui/TextField'

export default class CookbookInformation extends Component {

  onNameChange(_, v) {
    const { onNameChange } = this.props
    onNameChange(v)
  }

  onDescriptionChange(_, v) {
    const { onDescriptionChange } = this.props
    onDescriptionChange(v)
  }

  render() {
    const { name, description } = this.props
    return (
      <Grid fluid={true}>
        <Row start="xs">
          <Col xs={12}>
            <TextField
              id="name"
              floatingLabelText="Name"
              defaultValue={name}
              onChange={this.onNameChange.bind(this)}
            />
          </Col>
        </Row>
        <Row start="xs">
          <Col xs={12}>
            <TextField
              id="description"
              floatingLabelText="Description"
              defaultValue={description}
              onChange={this.onDescriptionChange.bind(this)}
            />
          </Col>
        </Row>
      </Grid>
    )
  }
}
