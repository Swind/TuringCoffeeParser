#Vendor 
require! {
    "react": React
    "redux": {createStore}
    "react-redux": {Provider, connect}
    "prelude-ls": {Obj}

    "./component": Component
    "./components/cookbook": CookbookList
    "./components/barista": Barista 


    "./reducers/Reducer": Reducer
}

# JS modules
require! {
    "./components/cookbook": cookbook
    "./components/barista": barista
}

# CSS
require! {
    "./scss/coffee.scss": coffee-css
}

class AddNewCookbookBtn extends Component
  render: ! ->
    return do
      @button {className: "mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored mdl-shadow--4dp mdl-color--accent" id:"add-cb-btn"},
        @i {className: "material-icons" role:"presentation"}, \add
        @span {className: "visuallyhidden"}, \Add

class Sidebar extends Component
  render: ! ->
    return do
      @div {className: "mdl-layout__drawer"},
        @span {className: "mdl-layout-title"}, \Actions
        @nav {className: "mdl-navigation"},
          @a {className: "mdl-navigation__link" href:""}, \Add


class Body extends Component
  render: !->
    const {cookbooks, editor, barista} = @props

    return do
      @div {className: "mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header"},

        # Header
        @header {className: "mdl-layout__header mdl-layout__header--scroll mdl-color--primary"},
           # Title
           @div {className: "mdl-layout--large-screen-only mdl-layout__header-row"},
             @span {className: "mdl-layout-title"}, "Turing Coffee"

           # Tab bar
           @div {className: "mdl-layout__tab-bar mdl-js-ripple-effect mdl-color--primary-dark"},
             @a {href: '#cookbooks' className: "mdl-layout__tab"}, "COOKBOOK"
             @a {href: '#barista' className: "mdl-layout__tab"}, "BARISTA"

        # Sidebar
        Sidebar.elem!

        # Main content
        @main {className:"mdl-layout__content" id:"main"},
          CookbookList.elem {cookbooks: cookbooks}
          Barista.elem {barista: barista}


body-elem = React.createFactory connect((state)->state)(Body)
/*==================================================================================
*
*   Root component with Provider
*
*=================================================================================*/
store = createStore Reducer
root-elem = document.getElementById "body"

provider-elem = React.createElement Provider, {store: store}, body-elem
React.render (React.DOM.div {}, [provider-elem]), root-elem

