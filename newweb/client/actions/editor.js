import { OPEN_EDITOR, CLOSE_EDITOR, CLOSE_SAVE_EDITOR, OPEN_REMOVE_DIALOG, CLOSE_REMOVE_DIALOG, SAVE_PROCESS, EDIT_NEW_PROCESS, APPEND_PROCESS, REMOVE_PROCESS, CLOSE_SNACKBAR, CHANGE_COOKBOOK_NAME, CHANGE_COOKBOOK_DESCRIPTION, MOVE_PROCESS } from '../constants'

function action(type, payload = {}) {
  return {type, ...payload}
}

export function openEditor(index, process) {
  return action(OPEN_EDITOR, {index, process})
}

export function closeEditor(index, process) {
  return action(CLOSE_EDITOR, {index, process})
}

export function closeSaveEditor(index, process) {
  return action(CLOSE_SAVE_EDITOR, {index, process})
}

export function saveProcess(process) {
  return action(SAVE_PROCESS, {process})
}

export function appendProcess(process) {
  return action(APPEND_PROCESS, {process})
}

export function moveProcess(from, to) {
  return action(MOVE_PROCESS, {from, to})
}

export function editNewProcess(process) {
  return action(EDIT_NEW_PROCESS, {process})
}

export function removeProcess(index, process) {
  return action(REMOVE_PROCESS, {index})
}

export function closeSnackbar() {
  return action(CLOSE_SNACKBAR, {})
}

export function changeCookbookName(name) {
  return action(CHANGE_COOKBOOK_NAME, {name})
}

export function changeCookbookDescription(description) {
  return action(CHANGE_COOKBOOK_DESCRIPTION, {description})
}
