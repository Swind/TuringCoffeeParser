require! {
  "../react-wrapper": {Component}
}

class CookbookEditor extends Component
  render: ! ->
    cookbook = @props.cookbook

    return do
      @div {className: "mdl-grid"},
        @div {className: "mdl-card mdl-shadow--4dp mdl-cell mdl-cell--12-col"},
          @div {className: "mdl-card__media mdl-color-text--grey-50"},
            @h3 {}, cookbook.name
          @div {className: "mdl-color-text--grey-700 mdl-card__support-text meta"},
            cookbook.description
          @div {className: "mdl-color-text--grey-700 mdl-card__support-text comment"},
            cookbook.content

map-state-to-props = (state) ->
  {cookbook: state.selected-cookbook}

module.exports = CookbookEditor.connect map-state-to-props

