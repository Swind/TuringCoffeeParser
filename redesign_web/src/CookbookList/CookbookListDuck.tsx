import { Record } from "immutable";
import { createAction, Action } from "redux-actions";
import { LIST_COOKBOOKS } from "../Api/apiDuck";
import { CookbookParams, Cookbook } from "../Api/cookbook";

export const INITIAL_STATE = Record({
  loading: true,
  result: false,
  newCookbookDialogOpen: false,
  cookbooks: [],
  searchKey: ""
});

const OPEN_NEW_COOKBOOK_DIALOG = "cookbookList/OPEN_NEW_COOKBOOK_DIALOG";
const CLOSE_NEW_COOKBOOK_DIALOG = "cookbookList/CLOSE_NEW_COOKBOOK_DIALOG";
const CHANGE_SEARCH_KEY = "cookbookList/CHANGE_SEARCH_KEY";

// Action
export const openNewCookbookDialog = createAction(OPEN_NEW_COOKBOOK_DIALOG);
export const closeNewCookbookDialog = createAction(CLOSE_NEW_COOKBOOK_DIALOG);
export const changeSearchCookbookKeyword = createAction(CHANGE_SEARCH_KEY);

// Reducer
export function cookbookListReducer(
  state = new INITIAL_STATE(),
  action: Action<any>
) {
  switch (action.type) {
    case OPEN_NEW_COOKBOOK_DIALOG:
      return state.set("newCookbookDialogOpen", true);
    case CLOSE_NEW_COOKBOOK_DIALOG:
      return state.set("newCookbookDialogOpen", false);
    case LIST_COOKBOOKS.REQUEST:
      return state.set("result", false).set("loading", true);
    case LIST_COOKBOOKS.SUCCESS:
      const cookbooks = action.payload.body.data.map((p: CookbookParams) => {
        return new Cookbook(p);
      });
      return state
        .set("result", true)
        .set("loading", false)
        .set("cookbooks", cookbooks);
    case LIST_COOKBOOKS.FAILURE:
      return state.set("result", false).set("loading", false);
    case CHANGE_SEARCH_KEY:
      return state.set("searchKey", action.payload);
    default:
      return state;
  }
}
