import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import { cookbookListReducer } from "./CookbookList/CookbookListDuck";
import { cookbookEditorReducer } from "./CookbookEditor/CookbookEditorDuck";
import { monitorReducer } from "./Monitor/MonitorDuck";

const rootReducer = combineReducers({
  cookbookList: cookbookListReducer,
  cookbookEditor: cookbookEditorReducer,
  monitor: monitorReducer,
  router: routerReducer
});

export default rootReducer;
