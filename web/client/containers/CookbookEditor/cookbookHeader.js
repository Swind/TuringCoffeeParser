import React, { Component } from 'react'

import Avatar from 'material-ui/Avatar'
import TextField from 'material-ui/TextField'
import List from 'material-ui/List/List'
import ListItem from 'material-ui/List/ListItem'

import TimerIcon from 'material-ui/svg-icons/image/timer'
import LocalDrinkIcon from 'material-ui/svg-icons/maps/local-drink'

class CookbookHeader extends Component {
  render () {
    const {cookbook} = this.props
    return (
      <div>
        <TextField
          id='title'
          style={{'width': '100%'}}
          required={true}
          floatingLabel={true}
          floatingLabelText='Title'
          value={cookbook.name}
        />
        <TextField
          id='description'
          style={{'width': '100%'}}
          required={true}
          floatingLabel={true}
          floatingLabelText='Description'
          value={cookbook.description}
        />
        <List>
          <ListItem
            disabled={true}
            leftAvatar={
              <Avatar icon={<TimerIcon/>}/>
            }
          >
            {0}
          </ListItem>
          <ListItem
            disabled={true}
            leftAvatar={
              <Avatar icon={<LocalDrinkIcon/>}/>
            }
          >
            {0}
          </ListItem>
        </List>
      </div>
    )
  }
}

export default CookbookHeader
