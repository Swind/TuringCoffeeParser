import React, { Component } from 'react'
import {Card, CardActions, CardHeader, CardTitle, CardText} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'

class CookbookCard extends Component {
  render() {
    const { title, subtitle, onEdit, onBrew, onCopy, onDelete } = this.props
    return (
      <Card>
        <CardTitle
          title={title}
          subtitle={subtitle}
        />
        <CardActions>
          <FlatButton label="Edit" onTouchTap={onEdit}/>
          <FlatButton label="Brew" onTouchTap={onBrew}/>
          <FlatButton label="Copy" onTouchTap={onCopy}/>
          <FlatButton label="Delete" onTouchTap={onDelete}/>
        </CardActions>
      </Card>
    )
  }
}

CookbookCard.propTypes = {
  title: React.PropTypes.string,
  subtitle: React.PropTypes.string,
  onEdit: React.PropTypes.func,
  onBrew: React.PropTypes.func,
  onCopy: React.PropTypes.func,
  onDelete: React.PropTypes.func
}

export default CookbookCard
