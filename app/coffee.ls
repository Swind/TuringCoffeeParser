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

class Body extends Component
  render: !->
    const {cookbooks, editor, barista} = @props

    return do
      @div {className: "mdl-layout mdl-js-layout mdl-layout--fixed-header"},

        # Header
        @header {className: "mdl-layout__header mdl-layout__header--scroll mdl-color--primary"},
           # Title
           @div {className: "mdl-layout--large-screen-only mdl-layout__header-row"}
           @div {className: "mdl-layout--large-screen-only mdl-layout__header-row"},
             @h3 {},
               "Turing Coffee"
           @div {className: "mdl-layout--large-screen-only mdl-layout__header-row"}

           # Tab bar
           @div {className: "mdl-layout__tab-bar mdl-js-ripple-effect mdl-color--primary-dark"},
             @a {href: '#cookbooks' className: "mdl-layout__tab"}, "COOKBOOK"
             @a {href: '#barista' className: "mdl-layout__tab"}, "BARISTA"

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

