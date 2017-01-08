
import { createStore, applyMiddleware } from 'redux'
import { createHashHistory } from 'history'
import createSagaMiddleware, { END } from 'redux-saga'
import { routerMiddleware } from 'react-router-redux'
import { useRouterHistory, browserHistory } from 'react-router'

import { logger } from '../middleware'
import root from '../sagas'
import rootReducer from '../reducers'

export const hashHistory = useRouterHistory(createHashHistory)({
  basename: '/new'
});

export function configure(initialState) {

  const sagaMiddleware = createSagaMiddleware()
  const router = routerMiddleware(hashHistory)

  const create = window.devToolsExtension
    ? window.devToolsExtension()(createStore)
    : createStore

  const createStoreWithMiddleware = applyMiddleware(
    sagaMiddleware,
    router,
    logger
  )(create)

  const store = createStoreWithMiddleware(rootReducer, initialState)

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers')
      store.replaceReducer(nextReducer)
    })
  }

  sagaMiddleware.run(root)

  return store
}
