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

    const {title, subtitle, href} = this.props

    return (
      <Card>
        <CardTitle title={title} subtitle={subtitle} actAsExpander={true} showExpandableButton={true}/>
        <CardText expandable={true}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
          Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
          Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
        </CardText>
        <CardActions>
          <Link to={href}>
            <FlatButton label='Edit'/>
          </Link>
        </CardActions>
      </Card>
    )
  }
}

export default CookbookCard;
