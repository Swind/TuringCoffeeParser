#Vendor 
require! {
    "react": React
    "react": {Component, PropTypes}
    "redux": {createStore}
    "react-redux": {Provider, connect}

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

{div, a, header, main, span, nav} = React.DOM

class Body extends Component
  componentWillMount: !->

  render: !->
    const {cookbooks, editor, barista} = @props

    return div {className: "mdl-layout mdl-js-layout"},

             # Header
             header {className: "mdl-layout__header"},
               div {className: "mdl-layout__header-row"}

             # Sidebar
             div {className: "mdl-layout__drawer"},
               span {className: "mdl-layout-title"},
                 "Turing Coffee"
               nav {className: "mdl-navigation", id:"sidebar"}

             # Main content
             main {className:"mdl-layout__content" id:"main"}

Body.propTypes = {}
body-elem = React.createFactory connect((state)->state)(Body)
/*==================================================================================
*
*   Root component with Provider
*
*=================================================================================*/
store = createStore Reducer
root-elem = document.getElementById "body"

provider-elem = React.createElement Provider, {store: store}, body-elem
React.render (div {}, [provider-elem]), root-elem

