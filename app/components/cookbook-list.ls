require! {
  "../react-wrapper": {Component}
  "../actions/CookbookActions": Actions
  "./card": Card
}

class CookbookCard extends Component
  render: ! ->
    cookbook = @props.cookbook

    card = new Card!

    card-menu = card.Menu "#{cookbook.id}-btn", [
      card.MenuItem "Copy", null
      card.MenuItem "Edit", null
    ]

    contents = [
      card.Desc cookbook.description
      card.Info \timer, "1 m 30 s"
      card.Info \local_drink, "500 ml"
    ]

    actions = [
      card.ActionLink "/editor/#{cookbook.id}", "Edit"
    ]

    return card.generateDOM cookbook.name, contents, actions, card-menu

class CookbookList extends Component
  render: ! ->
    const {dispatch, cookbooks} = @props

    return @div {className: "mdl-layout__tab-panel is-active" id:"cookbooks"},
             for id, cookbook of cookbooks
               CookbookCard.elem {cookbook: cookbook, key: id}

##################################################################################
#
#   Bind redux 
#
##################################################################################
map-state-to-props = (state) ->
  {cookbooks: state.cookbooks}

/*
map-dispatch-to-props = (dispatch) ->
  return {
    select-cookbook: (cookbook) -> dispatch Actions.select-cookbook cookbook
  }
*/

module.exports = CookbookList.connect map-state-to-props
