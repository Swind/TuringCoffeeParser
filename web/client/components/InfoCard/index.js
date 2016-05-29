import React, { Component } from 'react'
import Paper from 'material-ui/Paper'

const style = {
  height: 100,
  width: 200,
  margin: 20,
  textAlign: 'center',
  display: 'inline-block'
}

class InfoCard extends Component {

  render() {
    const {title, color, children} = this.props
    return (
      <Paper style={style} zDepth={1}>
        <header>{title}</header>
        <span style={{'font-size': '32px', 'color': color}}>{children}</span>
      </Paper>
    )
  }
}

export default InfoCard
