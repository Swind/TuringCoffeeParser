require! {
  "../react-wrapper": {Component}
  "../actions/CookbookActions": Actions
}

class CookbookCard extends Component
  render: ! ->
    cookbook = @props.cookbook

    return do
      @section {className: "cb-card section--center mdl-grid mdl-grid--no-spacing mdl-shadow--2dp"},

        # The picture of the cookbook
        @header {className: "section__play-btn mdl-cell mdl-cell--3-col-desktop mdl-cell--2-col-tablet mdl-cell--4-col-phone mdl-color--teal-100 mdl-color-text--white"},
          @i {className: "material-icons"}, \play_circle_filled

        # Cookbook information
        @div {className: "mdl-card mdl-cell mdl-cell--9-col-desktop mdl-cell--6-col-tablet mdl-cell--4-col-phone"},
          @div {className: "mdl-card__supporting-text"},
            @h3 {}, cookbook.name
            @div {className: "cb-desc"},
              @h4 {}, cookbook.description

            @div {className: "cb-info"},
              @i {className: "material-icons"}, \timer
              @h5 {}, "1 m 30 s"

            @div {className: "cb-info"},
              @i {className: "material-icons"}, \local_drink
              @h5 {}, "500 ml"


        # Cookbook actions
          @div {className: "mdl-card__actions"},
            @Link {to: "/editor/#{cookbook.id}" className:"mdl-button"}, "Edit"

        # Cookbook card menu
        @button {className: "mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" id: "#{cookbook.id}-btn"},
          @i {className: "material-icons"}, \more_vert
        @ul {className: "mdl-menu mdl-js-menu mdl-menu--bottom-right" htmlFor:"#{cookbook.id}-btn"},
          @li {className: "mdl-menu__item"}, \Copy
          @li {className: "mdl-menu__item"}, \Delete

class List extends Component
  render: ! ->
    const {dispatch, cookbooks} = @props

    return @div {className: "mdl-layout__tab-panel is-active" id:"cookbooks"},
             for id, cookbook of cookbooks
               CookbookCard.elem {cookbook: cookbook, select-cookbook:@props.select-cookbook}

##################################################################################
#
#   Bind redux 
#
##################################################################################
map-state-to-props = (state) ->
  {cookbooks: state.cookbooks}

map-dispatch-to-props = (dispatch) ->
  return {
    select-cookbook: (cookbook) -> dispatch Actions.select-cookbook cookbook 
  }

module.exports = List.connect map-state-to-props, map-dispatch-to-props
