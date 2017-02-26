export const REQUEST = 'REQUEST'
export const SUCCESS = 'SUCCESS'
export const FAILURE = 'FAILURE'

function createRequestType(base) {
  return [REQUEST, SUCCESS, FAILURE].reduce((acc, type) => {
    acc[type] = `${base}_${type}`
    return acc
  }, {})
}

export const LIST_COOKBOOK = createRequestType('LIST_COOKBOOK')
export const BREW_COOKBOOK = createRequestType('BREW_COOKBOOK')
export const GET_COOKBOOK = createRequestType('GET_COOKBOOK')
export const SAVE_COOKBOOK = createRequestType('SAVE_COOKBOOK')
export const COPY_COOKBOOK = createRequestType('COPY_COOKBOOK')
export const DELETE_COOKBOOK = createRequestType('DELETE_COOKBOOK')
export const GET_HEATER = createRequestType('GET_HEATER')
export const SET_TARGET_POINT = createRequestType('SET_TARGET_POINT')
export const SAVE_NEW_COOKBOOK = createRequestType('SAVE_NEW_COOKBOOK')

export const RESTART_PRINTER = createRequestType('RESTART_PRINTER')

export const OPEN_EDITOR = 'OPEN_EDITOR'
export const CLOSE_EDITOR = 'CLOSE_EDITOR'
export const OPEN_DELETE_COOKBOOK_DIALOG = 'OPEN_DELETE_COOKBOOK_DIALOG'
export const CLOSE_DELETE_COOKBOOK_DIALOG = 'CLOSE_DELETE_COOKBOOK_DIALOG'
export const CLOSE_SAVE_EDITOR = 'CLOSE_SAVE_EDITOR'
export const OPEN_REMOVE_DIALOG = 'OPEN_REMOVE_DIALOG'
export const CLOSE_REMOVE_DIALOG = 'CLOSE_REMOVE_DIALOG'
export const APPEND_PROCESS = 'APPEND_PROCESS'
export const MOVE_PROCESS = 'MOVE_PROCESS'
export const EDIT_NEW_PROCESS = 'EDIT_NEW_PROCESS'
export const SAVE_PROCESS = 'SAVE_PROCESS'
export const REMOVE_PROCESS = 'REMOVE_PROCESS'
export const CLOSE_SNACKBAR = 'CLOSE_SNACKBAR'
export const OPEN_DRAWER = 'OPEN_DRAWER'
export const CLOSE_DRAWER = 'CLOSE_DRAWER'
export const OPEN_SIDEBAR = 'OPEN_SIDEBAR'
export const CLOSE_SIDEBAR = 'CLOSE_SIDEBAR'

export const CHANGE_COOKBOOK_NAME = 'CHANGE_COOKBOOK_NAME'
export const CHANGE_COOKBOOK_DESCRIPTION = 'CHANGE_COOKBOOK_DESCRIPTION'

export const OPEN_NEW_COOKBOOK_DIALOG = 'OPEN_NEW_COOKBOOK_DIALOG'
export const CLOSE_NEW_COOKBOOK_DIALOG = 'CLOSE_NEW_COOKBOOK_DIALOG'
export const OPEN_COPY_COOKBOOK_DIALOG = 'OPEN_COPY_COOKBOOK_DIALOG'
export const CLOSE_COPY_COOKBOOK_DIALOG = 'CLOSE_COPY_COOKBOOK_DIALOG'
