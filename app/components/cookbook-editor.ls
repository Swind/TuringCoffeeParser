require! {
  "../react-wrapper": {Component}
  "./card": Card
}

class ProcessCard extends Component
  render: ! ->
    process = @props.process
    id = @props.id

    card = new Card!

    card-menu = card.Menu "process-card-#{id}-btn", [
      card.MenuItem "Copy", null
      card.MenuItem "Edit", null
    ]

    contents = [
      card.Desc process.description
      card.Info \timer, "1 m 30 s"
      card.Info \local_drink, "500 ml"
    ]

    actions = [
    ]

    return card.generateDOM process.name, contents, actions, card-menu

class CookbookEditor extends Component
  render: ! ->
    id = @props.params.cookbook-id

    cookbook = @props.cookbooks[id]

    card = new Card!

    card-menu = card.Menu "detail-btn", [
      card.MenuItem "Delete", null
    ]

    contents = [
      card.Desc cookbook.description
      card.Info \timer, "1 m 30 s"
      card.Info \local_drink, "500 ml"
    ]

    return do
      # The detail data of this cookbook
      @div {className: "cb-editor mdl-grid"},
        @div {className: "mdl-cell--middle mdl-cell--12-col"},
          card.generateDOM cookbook.name, contents, [], card-menu

        # Show all porcess
        for process, index in cookbook.content
          @div {className: "mdl-cell--12-col mdl-cell--middle"},
            ProcessCard.elem {process: process, key: index, id: index}

map-state-to-props = (state) ->
  {
    cookbooks: state.cookbooks
  }

module.exports = CookbookEditor.connect map-state-to-props

