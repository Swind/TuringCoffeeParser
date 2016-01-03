require! {
  "../react-wrapper": {Component, bindActionCreators}
  "../actions/CookbookEditingActions": Actions
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
class CookbookSummary extends Component
  render: ->
    @div {style: {height: "100%", width: "300px", position: "fixed", left: 0, top: 0}}, do
      Component.create @Layout, {fixedDrawer: true}, do
        Component.create @Drawer, {title: 'Title'}, do
          items = []
          for process, index in @props.cookbook.content
            item = do
              @a {href: "\##{index}"}, do
                @span null, process.name
            items.push item
          Component.create @Navigation, null, items

class CookbookEditor extends Component

  render: ! ->
    id = @props.params.cookbookId
    cookbook = if @props.editing == undefined
      then @props.cookbooks[id]
      else @props.editing

    card = new Card!

    editable-name = do
      Component.create @Textfield, do
        * label: 'Title',
          value: cookbook.name,
          style: {width: "100%"}
          floatingLabel: true
          required: true
          onChange: (e) ~>
            new_cookbook = Object.assign {}, cookbook
            new_cookbook.name = e.target.value
            @props.updateEditingCookbook new_cookbook

    editable-description = do
      Component.create @Textfield, do
        * label: 'Description',
          value: cookbook.description,
          style: {width: "100%"}
          rows: 3
          floatingLabel: true
          onChange: (e) ~>
            new_cookbook = Object.assign {}, cookbook
            new_cookbook.description = e.target.value
            @props.updateEditingCookbook new_cookbook

    contents = [
      card.Desc editable-description
      card.Info \timer, "1 m 30 s"
      card.Info \local_drink, "500 ml"
    ]

    return do
      # The detail data of this cookbook
      @div {className: "cb-editor mdl-grid"},
        @div {className: "mdl-cell--middle mdl-cell--12-col"},
          card.generateDOM editable-name, contents, [], null

        # Show all porcess
        for process, index in cookbook.content
          @div {className: "mdl-cell--12-col mdl-cell--middle"},
            ProcessCard.elem {process: process, key: index, id: index}

        CookbookSummary.elem {cookbook: cookbook}

map-state-to-props = (state) ->
  * cookbooks: state.cookbooks
    editing: state.editor.cookbook

map-dispatch-to-props = (dispatch) ->
  bindActionCreators Actions, dispatch

module.exports = CookbookEditor.connect map-state-to-props, map-dispatch-to-props

