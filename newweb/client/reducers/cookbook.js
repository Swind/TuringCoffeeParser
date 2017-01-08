import {
  LIST_COOKBOOK,
  SAVE_NEW_COOKBOOK,
  DELETE_COOKBOOK,
  OPEN_NEW_COOKBOOK_DIALOG,
  CLOSE_NEW_COOKBOOK_DIALOG,
  COPY_COOKBOOK,
  OPEN_DELETE_COOKBOOK_DIALOG,
  CLOSE_DELETE_COOKBOOK_DIALOG
} from '../constants'

const initialState = {
  cookbooks: [],
  loading: true,
  failure: false,
  reason: null,
  newCookbookDialogOpen: false,
  copyCookbookDialogOpen: false,
  deleteCookbookDialogOpen: false,
  copyId: null,
  toBeDeletedCookbook: null
}

export function cookbook(state=initialState, action) {
  switch(action.type) {
    case LIST_COOKBOOK.SUCCESS:
      return {
        ...state,
        cookbooks: action.cookbooks,
        loading: false,
        failure: false,
        reason: null
      }
    case LIST_COOKBOOK.FAILURE:
      return {
        ...state,
        loading: false,
        failure: true,
        reason: action.error
      }
    case LIST_COOKBOOK.REQUEST:
      return {
        ...state,
        loading: true
      }
    case SAVE_NEW_COOKBOOK.SUCCESS:
      return {
        ...state,
        newCookbookDialogOpen: false
      }
    case SAVE_NEW_COOKBOOK.FAILURE:
      return {
        ...state
      }
    case OPEN_NEW_COOKBOOK_DIALOG:
      return {
        ...state,
        newCookbookDialogOpen: true
      }
    case CLOSE_NEW_COOKBOOK_DIALOG:
      return {
        ...state,
        newCookbookDialogOpen: false
      }
    case DELETE_COOKBOOK.SUCCESS:
      return {
        ...state,
        toBeDeletedCookbook: null,
        deleteCookbookDialogOpen: false
      }
    case COPY_COOKBOOK.SUCCESS:
      return {
        ...state
      }
    case OPEN_DELETE_COOKBOOK_DIALOG:
      return {
        ...state,
        toBeDeletedCookbook: action.cookbook,
        deleteCookbookDialogOpen: true
      }
    case CLOSE_DELETE_COOKBOOK_DIALOG:
      return {
        ...state,
        toBeDeletedCookbook: null,
        deleteCookbookDialogOpen: false
      }
    default:
      return state
  }
}
