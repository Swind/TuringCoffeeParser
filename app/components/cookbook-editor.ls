require! {
  "../react-wrapper": {Component}

}

class ProcessCard extends Component
  render: ! ->
    process = @props.process

    return do
      @div {className: "mdl-card mdl-shadow--4dp mdl-cell mdl-cell--middle mdl-cell--12-col"},
        @div {className: "mdl-card__title"},
          @h2 {className: "mdl-card__title-text"}, process.name
        @div {className: "mdl-color-text--grey-700 mdl-card__support-text meta"},
          process.total_water

class CookbookEditor extends Component
  render: ! ->
    id = @props.params.cookbook-id

    cookbook = @props.cookbooks[id]

    return do
      @div {className: "cb-editor mdl-grid"},
        @div {className: "mdl-card mdl-shadow--4dp mdl-cell mdl-cell--middle mdl-cell--12-col"},
          @div {className: "mdl-card__title"},
            @h2 {className: "mdl-card__title-text"}, cookbook.name
          @div {className: "mdl-color-text--grey-700 mdl-card__support-text meta"},
            cookbook.description
        
        for process, index in cookbook.content
          ProcessCard.elem {process: process, key: index}

map-state-to-props = (state) ->
  {
    cookbooks: state.cookbooks
  }

module.exports = CookbookEditor.connect map-state-to-props

