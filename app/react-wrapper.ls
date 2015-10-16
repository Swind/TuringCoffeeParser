require! {
    "react": React
    "react-router": ReactRouter
    "react-redux": ReactRedux 
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
          provider {store: store}, (-> root-class.elem {children: children})
        

  return wrapper

module.exports = {
  Component
  apply-provider
}
