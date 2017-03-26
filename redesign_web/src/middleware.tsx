import { applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';

import { history } from './history';

export const sagaMiddleware = createSagaMiddleware();
export default applyMiddleware(
  sagaMiddleware,
  routerMiddleware(history)
);
