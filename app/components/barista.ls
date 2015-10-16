require! {
  "../react-wrapper": {Component}
}

class Barista extends Component
  render: ! ->
    const {dispatch, cookbooks} = @props

    return @div {className: "mdl-layout__tab-panel" id: "barista"},
             "Hello World!"

module.exports = Barista
