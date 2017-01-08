import { GET_COOKBOOK, OPEN_EDITOR, CLOSE_SAVE_EDITOR, CLOSE_EDITOR, REMOVE_PROCESS, SAVE_PROCESS, SAVE_COOKBOOK, CLOSE_SNACKBAR, EDIT_NEW_PROCESS, APPEND_PROCESS, MOVE_PROCESS, CHANGE_COOKBOOK_NAME, CHANGE_COOKBOOK_DESCRIPTION } from '../constants'

const inititalState = {
  cookbook: null,
  loading: true,
  failure: false,
  reason: null,
  editorOpen: false,
  editProcess: null,
  saveOpen: false,
  saveResult: "",
  index: -1,
}

export function editor(state=inititalState, action) {
  switch(action.type) {
    case GET_COOKBOOK.SUCCESS:
      return {
        ...state,
        cookbook: action.cookbook,
        loading: false,
        failure: false,
        reason: null
      }
    case GET_COOKBOOK.FAILURE:
      return {
        ...state,
        loading: false,
        failure: true,
        reason: action.error
      }
    case GET_COOKBOOK.REQUEST:
      return {
        ...state,
        loading: true
      }
    case OPEN_EDITOR:
      return {
        ...state,
        editorOpen: true,
        index: action.index,
        editProcess: Object.assign({}, state.cookbook.processes[action.index]),
      }
    case CLOSE_SAVE_EDITOR:
      {
        let copyCookbook = Object.assign({}, state.cookbook)
        copyCookbook.processes[state.index] = state.editProcess
        return {
          ...state,
          cookbook: copyCookbook,
          editorOpen: false,
          index: -1,
          editProcess: null,
        }
      }
    case CLOSE_EDITOR:
      return {
        ...state,
        cookbook: state.cookbook,
        editorOpen: false,
        index: -1,
        editProcess: null
      }
    case APPEND_PROCESS:
      {
        let copyCookbook = Object.assign({}, state.cookbook)
        const len = copyCookbook.processes.push(action.process)
        return {
          ...state,
          cookbook: copyCookbook,
          editorOpen: true,
          index: len - 1,
          editProcess: action.process
        }
      }
    case EDIT_NEW_PROCESS:
      {
        return {
          ...state,
          cookbook: state.cookbook,
          editorOpen: true,
          index: state.cookbook.processes.length,
          editProcess: action.process
        }
      }
    case REMOVE_PROCESS:
      {
        let copyCookbook = Object.assign({}, state.cookbook)
        copyCookbook.processes.splice(action.index, 1)
        return {
          ...state,
          cookbook: copyCookbook
        }
      }
    case SAVE_PROCESS:
      return {
        ...state,
        editProcess: action.process
      }
    case MOVE_PROCESS:
      {
        let copyCookbook = Object.assign({}, state.cookbook)
        const from = copyCookbook.processes.splice(action.from, 1)
        copyCookbook.processes.splice(action.to, 0, ...from)
        return {
          ...state,
        }
      }
    case SAVE_COOKBOOK.REQUEST:
      return {
        ...state
      }
    case SAVE_COOKBOOK.SUCCESS:
      return {
        ...state,
        saveOpen: true,
        saveResult: "Save cookbook success"
      }
    case SAVE_COOKBOOK.FAILURE:
      return {
        ...state,
        saveOpen: true,
        saveResult: "Save cookbook failure: " + action.error
      }
    case CLOSE_SNACKBAR:
      return {
        ...state,
        saveOpen: false,
        saveResult: ''
      }
    case CHANGE_COOKBOOK_NAME:
      {
        let copyCookbook = Object.assign({}, state.cookbook)
        copyCookbook.name = action.name
        return {
          ...state,
          cookbook: copyCookbook
        }
      }
    case CHANGE_COOKBOOK_DESCRIPTION:
      {
        let copyCookbook = Object.assign({}, state.cookbook)
        copyCookbook.description = action.description
        return {
          ...state,
          cookbook: copyCookbook
        }
      }
    default:
      return state
  }
}
