require! {
  "../react-wrapper": {Component, Template}
}

class MenuComponent extends Component
  componentWillMount: !->
    if @_element
      window.componentHandler.downgradeElements @_element

  componentDidMount: !->
    window.componentHandler.upgradeElements @_element

  safeRef: (e) !~>
    @_element = e

  render: ->
    @ul {className: "mdl-menu mdl-js-menu mdl-menu--bottom-right" htmlFor: @props.menu-id, ref: @safeRef},
      @props.items

class Card extends Template

  MenuItem: (name, click-action) ->
    return @li {className: "mdl-menu__item" onClick: click-action}, name

  Menu: (menu-id, items) ->
    [
      @button {className: "mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon", id: menu-id}, do
        @i {className: "material-icons"}, \more_vert
      MenuComponent.elem {menu-id: menu-id, items: items}
    ]

  Desc: (desc) ->
    return do
      @div {className: "cb-desc"},
        @h4 {}, desc

  Info: (icon-name, info) ->
    return do
      @div {className: "cb-info"},
        @i {className: "material-icons"}, icon-name
        @h5 {}, info

  ActionLink: (url, name) ->
    return do
      @Link {to: url, className:"mdl-button"}, name

  generateDOM: (title, contents, actions, menu) ->
    return do
      @section {className: "cb-card section--center mdl-grid mdl-grid--no-spacing mdl-shadow--2dp"},

        # Picture 
        @header {className: "section__play-btn mdl-cell mdl-cell--3-col-desktop mdl-cell--2-col-tablet mdl-cell--4-col-phone mdl-color--teal-100 mdl-color-text--white"},
          @i {className: "material-icons"}, \play_circle_filled

        # Information
        @div {className: "mdl-card mdl-cell mdl-cell--9-col-desktop mdl-cell--6-col-tablet mdl-cell--4-col-phone"},
          @div {className: "mdl-card__supporting-text"},
            @h3 {}, title
            contents
          @div {className: "mdl-card__actions"},
            actions

        menu

module.exports = Card 
