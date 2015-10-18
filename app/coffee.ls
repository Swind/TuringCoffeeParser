#Vendor 
require! {
  "react": React

  "./react-wrapper": {Component, apply-provider}
  "./components/cookbook": CookbookList
  "./components/barista": Barista
  "./reducers/Reducer": Reducer
}

# CSS
require! {
  "./libs/css/material.min.css": material-css
  "./scss/coffee.scss": coffee-css
}

# JS
require! {
  "./libs/js/material.min.js": material-js
}

class FloatActionButton extends Component
  render: ! ->
    return do
      @button {className: "mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored mdl-shadow--4dp mdl-color--accent" id:"add-cb-btn"},
        @i {className: "material-icons" role:"presentation"}, \add
        @span {className: "visuallyhidden"}, \Add

class Body extends Component
  render: !->
    return do
      @div {className: "mdl-layout mdl-js-layout mdl-layout--fixed-header"},

        # Header
        @header {className: "mdl-layout__header mdl-layout__header--scroll mdl-color--primary"},

           # Tab bar
           @div {className: "mdl-layout__tab-bar mdl-js-ripple-effect mdl-color--primary-dark is-real-link"},
             @Link {to: '/cookbooks' className: "mdl-layout__tab is-active"}, "COOKBOOK"
             @Link {to: '/barista' className: "mdl-layout__tab"}, "BARISTA"

           FloatActionButton.elem!

        # Main content
        @main {className:"mdl-layout__content" id:"main"},
          @props.children

class RouterClass extends Component
  render: ! ->
    return do
      @Router null,
        @Route {path: "/" component: Body},
          @IndexRoute {component: CookbookList}
          @Route {path: "cookbooks" component: CookbookList}
          @Route {path: "barista" component: Barista}

render-target = document.getElementById "body"
React.render (React.create-element (apply-provider RouterClass, Reducer), null), render-target
