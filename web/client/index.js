
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { Provider } from 'react-redux'

import ReactDOM from 'react-dom'
import React from 'react'

import App from './containers/Main'
import CookbookList from './containers/CookbookList'
import CookbookEditor from './containers/CookbookEditor'
import configure from './store'

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const store = configure();
const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={App}>
        <IndexRoute component={CookbookList}></IndexRoute>
        <Route path='cookbooks' component={CookbookList}></Route>
        <Route path='editor/:cookbookId' component={CookbookEditor}></Route>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
)
