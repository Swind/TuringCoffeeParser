import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';

import 'grommet/grommet.min.css';

import configure from './store';
import TuringCoffee from './TuringCoffee/TuringCoffee';

import { history } from './history';


const store = configure();

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Route path='/' component={TuringCoffee} />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);
