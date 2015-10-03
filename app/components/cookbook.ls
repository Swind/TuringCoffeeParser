require! {
  "../component": Component
}

class NewCard extends Component
  render: ! ->
    return do
      @div {className: "mdl-card mdl-cell mdl-cell--8-col mdl-cell--4-col-desktop mdl-shadow--2dp"},
        @div {className: "mdl-card__title"},
          @h2 {className: "mdl-card__title-text"}, "Create new cookbook"

        @div {className: "mdl-card__media"},
          @i {className: "material-icons"}, \note_add

        @div {className: "mdl-card__supporting-text"}, "Description"

        @div {className: "mdl-card__actions mdl-card--border"},
          @a {className: "mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"}, \Create


class List extends Component
  render: ! ->
    const {dispatch, cookbooks} = @props

    return @div {className: "cookbook-list mdl-grid"},
             NewCard.elem!

module.exports = List
