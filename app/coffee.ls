#Vendor 
require! {
  "react": React
  "react-dom": ReactDOM
  "history/lib/createBrowserHistory": create-browser-history

  "./react-wrapper": {Component, apply-provider}
  "./components/cookbook-list": CookbookList
  "./components/cookbook-editor": CookbookEditor
  "./components/barista": Barista
  "./reducers/Reducer": Reducer

  "material-ui/lib/tabs/tabs": Tabs
  "material-ui/lib/tabs/tab": Tab
  "material-ui/lib/floating-action-button": FloatingActionButton
  "material-ui/lib/svg-icons/content/add": ContentAdd
}

# CSS
require! {
  "material-design-lite/material.min.css": material-css
  "./scss/coffee.scss": coffee-css
  "./scss/editor.scss": editor-css
  "./scss/step.scss": step-css
}

# JS
require! {
  "material-design-lite/material.js": material-js
}

class Body extends Component

  onTabClick: (tab) ~>
    window.location.assign "##{tab.props.route}"

  render: !->
    return do
      @div {className: "mdl-layout mdl-js-layout mdl-layout--fixed-header"}, do
        [
          Component.create Tabs, null, do
            [
              Component.create do
                Tab
                label: "COOKBOOK"
                route: '/cookbooks'
                onActive: @onTabClick
              Component.create do
                Tab
                label: "BARISTA"
                route: '/barista'
                onActive: @onTabClick
            ]

          @div null, do
            Component.create do
              FloatingActionButton
              style: do
                position: 'fixed'
                top: '20px'
                right: '20px'
                z-index: 5
              Component.create ContentAdd

          # Main content
          @main {className:"mdl-layout__content" id:"main"},
            @props.children
        ]

class RouterClass extends Component
  render: ! ->
    history = create-browser-history!
    return do
      @Router {},
        @Route {path: "/" component: Body},
          @IndexRoute {component: CookbookList}
          @Route {path: "cookbooks" component: CookbookList}
          @Route {path: "barista" component: Barista}
          @Route {path: "editor/:cookbookId" component: CookbookEditor}

render-target = document.getElementById "body"
ReactDOM.render (React.create-element (apply-provider RouterClass, Reducer), null), render-target
