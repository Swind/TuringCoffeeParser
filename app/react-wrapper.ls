require! {
    "react": React
    "react-dom": ReactDOM
    "react-router": ReactRouter
    "react-redux": ReactRedux 
    "classnames": ClassNames
}

/*==================================================================================
*
*   React wrapper 
*
*=================================================================================*/
class Component extends React.Component implements React.DOM

  Router: React.create-factory ReactRouter.Router
  Route: React.create-factory ReactRouter.Route
  IndexRoute: React.create-factory ReactRouter.IndexRoute
  Link: React.create-factory ReactRouter.Link
  ClassNames: ClassNames

  @elem = ->
    React.create-factory(@) ...

  @connect = ->
    ReactRedux.connect(...) @

apply-provider = (root-class, store) ->

  provider = React.create-factory ReactRedux.Provider

  wrapper = React.create-class do
    render: ! ->
      children = @props.children

      return do
        React.DOM.div null,
          provider {store: store}, root-class.elem!

  return wrapper

class Template implements React.DOM
  Link: React.create-factory ReactRouter.Link

module.exports = {
  Component
  Template
  apply-provider
}
