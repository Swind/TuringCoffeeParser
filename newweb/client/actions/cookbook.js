import { createAction } from 'redux-actions'
import {
  LIST_COOKBOOK,
  GET_COOKBOOK,
  SAVE_COOKBOOK,
  DELETE_COOKBOOK,
  COPY_COOKBOOK,
  BREW_COOKBOOK,
  SAVE_NEW_COOKBOOK,
  OPEN_NEW_COOKBOOK_DIALOG,
  CLOSE_NEW_COOKBOOK_DIALOG,
  OPEN_COPY_COOKBOOK_DIALOG,
  CLOSE_COPY_COOKBOOK_DIALOG,
  OPEN_DELETE_COOKBOOK_DIALOG,
  CLOSE_DELETE_COOKBOOK_DIALOG
} from '../constants'

function action(type, payload = {}) {
  return {type, ...payload}
}

export const listCookbook = {
  request: () => action(LIST_COOKBOOK.REQUEST),
  success: (cookbooks) => action(LIST_COOKBOOK.SUCCESS, {cookbooks}),
  failure: (error) => action(LIST_COOKBOOK.FAILURE, {error}),
}

export const getCookbook = {
  request: (id) => action(GET_COOKBOOK.REQUEST, {id}),
  success: (cookbook) => action(GET_COOKBOOK.SUCCESS, {cookbook}),
  failure: (error) => action(GET_COOKBOOK.FAILURE, {error})
}

export const deleteCookbook = {
  request: (id) => action(DELETE_COOKBOOK.REQUEST, {id}),
  success: (cookbook) => action(DELETE_COOKBOOK.SUCCESS, {cookbook}),
  failure: (error) => action(DELETE_COOKBOOK.FAILURE, {error})
}

export const copyCookbook = {
  request: (id) => action(COPY_COOKBOOK.REQUEST, {id}),
  success: (cookbook) => action(COPY_COOKBOOK.SUCCESS, {cookbook}),
  failure: (error) => action(COPY_COOKBOOK.FAILURE, {error})
}

export const saveCookbook = {
  request: (id, cookbook) => action(SAVE_COOKBOOK.REQUEST, {id, cookbook}),
  success: () => action(SAVE_COOKBOOK.SUCCESS, {success: true}),
  failure: (error) => action(SAVE_COOKBOOK.FAILURE, {error})
}

export const brewCookbook = {
  request: (id) => action(BREW_COOKBOOK.REQUEST, {id}),
  success: () => action(BREW_COOKBOOK.SUCCESS, {}),
  failure: (error) => action(BREW_COOKBOOK.FAILURE, {error})
}

export const saveNewCookbook = {
  request: (name, description) => action(SAVE_NEW_COOKBOOK.REQUEST, {name, description, processes: []}),
  success: () => action(SAVE_NEW_COOKBOOK.SUCCESS, {}),
  failure: (error) => action(SAVE_NEW_COOKBOOK.FAILURE, {error})
}

export function openNewCookbookDialog() {
  return action(OPEN_NEW_COOKBOOK_DIALOG, {})
}

export function closeNewCookbookDialog() {
  return action(CLOSE_NEW_COOKBOOK_DIALOG, {})
}

export function openCopyCookbookDialog(id) {
  return action(OPEN_COPY_COOKBOOK_DIALOG, {id})
}

export function closeCopyCookbookDialog() {
  return action(CLOSE_COPY_COOKBOOK_DIALOG, {})
}

export function openDeleteCookbookDialog(cookbook) {
  return action(OPEN_DELETE_COOKBOOK_DIALOG, {cookbook})
}

export function closeDeleteCookbookDialog() {
  return action(CLOSE_DELETE_COOKBOOK_DIALOG, {})
}
