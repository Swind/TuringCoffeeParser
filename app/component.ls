require! {
    "react": React
}

/*==================================================================================
*
*   React wrapper 
*
*=================================================================================*/
class Component extends React.Component implements React.DOM
  @elem = ->
    React.create-factory(@) ...

module.exports = Component
