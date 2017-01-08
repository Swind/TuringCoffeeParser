
import { Router, Route, IndexRoute, useRouterHistory } from 'react-router'
import { createHashHistory } from 'history'
import { syncHistoryWithStore } from 'react-router-redux'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom'
import React from 'react'
import injectTapEventPlugin from 'react-tap-event-plugin'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import flexboxcss from 'flexboxgrid/css/flexboxgrid.css'

import App from './containers/App'
import CookbookList from './containers/CookbookList'
import CookbookEditor from './containers/CookbookEditor'
import BaristaMonitor from './containers/BaristaMonitor'

import { configure, hashHistory } from './store'

injectTapEventPlugin()

const store = configure()
const history = syncHistoryWithStore(hashHistory, store)

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: '#4E342E',
    accent1Color: '#6D4C41'
  }
});


ReactDOM.render(
  <MuiThemeProvider muiTheme={muiTheme}>
    <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={App}>
          <IndexRoute component={CookbookList}></IndexRoute>
          <Route path="editor/:cookbookId" component={CookbookEditor}></Route>
          <Route path="monitor" component={BaristaMonitor}></Route>
        </Route>
      </Router>
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root')
)
