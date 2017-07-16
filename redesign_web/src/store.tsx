import { createStore } from "redux";
import middleware, { sagaMiddleware } from "./middleware";
import rootReducer from "./reducer";
import rootSaga from "./saga";

const _window: any = window;
const _module: any = module;

export default function configure() {
  const create =
    (_window["devToolsExtension"] &&
      _window["devToolsExtension"]()(createStore)) ||
    createStore;
  const createStoreWithMiddleware = middleware(create);
  const store = createStoreWithMiddleware(rootReducer, {});

  if (_module.hot) {
    _module.hot.accept("./reducer", () => {
      const nextReducer = require("./reducer");
      store.replaceReducer(nextReducer);
    });
  }

  sagaMiddleware.run(rootSaga);

  return store;
}
