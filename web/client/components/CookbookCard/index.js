import React, {Component} from 'react'
import { Link } from 'react-router'
import Card from 'material-ui/Card/Card'
import CardActions from 'material-ui/Card/CardActions'
import CardHeader from 'material-ui/Card/CardHeader'
import CardMedia from 'material-ui/Card/CardMedia'
import CardTitle from 'material-ui/Card/CardTitle'
import FlatButton from 'material-ui/FlatButton'
import CardText from 'material-ui/Card/CardText'

class CookbookCard extends Component {
  render() {

    const {title, subtitle, href, onDelete, onBrew, onCopy} = this.props

    return (
      <Card>
        <CardTitle title={title} subtitle={subtitle} actAsExpander={true}/>
        <CardActions>
          <Link to={href}>
            <FlatButton label='Edit'/>
          </Link>
          <FlatButton label='Brew' onMouseUp={onBrew}/>
          <FlatButton label='Delete' secondary={true} onMouseUp={onDelete}/>
          <FlatButton label='Copy' secondary={true} onMouseUp={onCopy}/>
        </CardActions>
      </Card>
    )
  }
}

export default CookbookCard;
