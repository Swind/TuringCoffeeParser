import React, { Component } from 'react'

import Avatar from 'material-ui/Avatar'
import TextField from 'material-ui/TextField'
import List from 'material-ui/List/List'
import ListItem from 'material-ui/List/ListItem'

import TimerIcon from 'material-ui/svg-icons/image/timer'
import LocalDrinkIcon from 'material-ui/svg-icons/maps/local-drink'

import { PROCESS } from '../../constants/processes.js'

class CookbookHeader extends Component {

  onNameChange (_, v) {
    const {cookbook, onChange} = this.props
    let clone = Object.assign({}, this.props.cookbook)
    clone.name = v
    onChange(clone)
  }

  onDescChange (_, v) {
    const {cookbook, onChange} = this.props
    let clone = Object.assign({}, this.props.cookbook)
    clone.description = v
    onChange(clone)
  }

  render () {
    const {cookbook} = this.props

    const totalTime = cookbook.processes.reduce((prev, x) => {
      const handle = new PROCESS[x.name].handle(x)
      return prev + handle.time
    }, 0)

    const totalWater = cookbook.processes.reduce((prev, x) => {
      const handle = new PROCESS[x.name].handle(x)
      return prev + handle.water
    }, 0)

    return (
      <div>
        <TextField
          id={`${cookbook._id}_title`}
          style={{'width': '100%'}}
          required={true}
          floatingLabel={true}
          floatingLabelText='Title'
          value={cookbook.name}
          onChange={this.onNameChange.bind(this)}
        />
        <TextField
          id={`${cookbook._id}_description`}
          style={{'width': '100%'}}
          required={true}
          floatingLabel={true}
          floatingLabelText='Description'
          value={cookbook.description}
          onChange={this.onDescChange.bind(this)}
        />
        <List>
          <ListItem
            disabled={true}
            leftAvatar={
              <Avatar icon={<TimerIcon/>}/>
            }
          >
            {`${totalTime} seconds`}
          </ListItem>
          <ListItem
            disabled={true}
            leftAvatar={
              <Avatar icon={<LocalDrinkIcon/>}/>
            }
          >
            {`${totalWater} ml`}
          </ListItem>
        </List>
      </div>
    )
  }
}

export default CookbookHeader
