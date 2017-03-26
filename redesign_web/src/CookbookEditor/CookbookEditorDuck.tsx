import { Record } from "immutable";
import { createAction, Action } from "redux-actions";
import { GET_COOKBOOK, SAVE_COOKBOOK } from "../Api/apiDuck";

export const INITIAL_STATE = Record({
  loading: true,
  result: false,
  notify: null,
  cookbookParams: null
});

const MODIFY_COOKBOOK = "cookbookEditor/MODIFY_COOKBOOK";
const CLOSE_NOTIFICATION = "cookbookEditor/CLOSE_NOTIFICATION";

// action
export const modifyCookbook = createAction(MODIFY_COOKBOOK);
export const closeNotification = createAction(CLOSE_NOTIFICATION);

// reducer
export function cookbookEditorReducer(
  state = new INITIAL_STATE(),
  action: Action<any>
) {
  switch (action.type) {
    case GET_COOKBOOK.SUCCESS:
      return state
        .set("loading", false)
        .set("result", true)
        .set("cookbookParams", action.payload.body.data);

    case GET_COOKBOOK.FAILURE:
      return state.set("loading", false).set("result", false);

    case MODIFY_COOKBOOK:
      return state.set("cookbookParams", action.payload);

    case SAVE_COOKBOOK.SUCCESS:
      return state.set("notify", {
        status: "ok",
        result: "Save cookbook successfully"
      });

    case SAVE_COOKBOOK.FAILURE:
      return state.set("notify", {
        status: "critical",
        result: action.payload
      });

    case CLOSE_NOTIFICATION:
      return state.set("notify", null);

    default:
      return state;
  }
}
