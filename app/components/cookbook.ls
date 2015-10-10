require! {
  "../component": Component
}

class CookbookCard extends Component
  render: ! ->
    cookbook = @props.cookbook

    return do
      @section {className: "section--center mdl-grid mdl-grid--no-spacing mdl-shadow--2dp"},

        @header {className: "section__play-btn mdl-cell mdl-cell--3-col-desktop mdl-cell--2-col-tablet mdl-cell--4-col-phone mdl-color--teal-100 mdl-color-text--white"},
          @i {className: "material-icons"}, \play_circle_filled

        @div {className: "mdl-card mdl-cell mdl-cell--9-col-desktop mdl-cell--6-col-tablet mdl-cell--4-col-phone"},
          @div {className: "mdl-card__supporting-text"},
            @h4 {}, \Description,
              "Test Description"
          @div {className: "mdl-card__actions"},
            @a {href: '#' className:"mdl-button"}, "Read our features"

        @button {className: "mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" id: "cookbook-btn"},
          @i {className: "material-icons"}, \more_vert
        @ul {className: "mdl-menu mdl-js-menu mdl-menu--bottom-right" htmlFor:"cookbook-btn"},
          @li {className: "mdl-menu__item"}, \Copy
          @li {className: "mdl-menu__item"}, \Delete

class List extends Component
  render: ! ->
    const {dispatch, cookbooks} = @props

    return @div {className: "mdl-layout__tab-panel is-active" id:"cookbooks"},
             CookbookCard.elem!

module.exports = List
