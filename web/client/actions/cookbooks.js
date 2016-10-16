import { createAction } from 'redux-actions'
import { asyncGetRequest, asyncPutRequest, asyncPostRequest, asyncDeleteRequest } from './asyncRequest'

const _list = createAction('list cookbooks')
const _load = createAction('load cookbook')
const _save = createAction('save cookbook')
const _create = createAction('create cookbook')
const _remove = createAction('remove cookbook')
const _brew = createAction('Brew')
const _copy = createAction('copy cookbook')

export const list = () => asyncGetRequest(_list, '/api/cookbooks')
export const load = id => asyncGetRequest(_load, `/api/cookbooks/${id}`)
export const save = (id, content) => asyncPutRequest(_save, `/api/cookbooks/${id}`, content)
export const create = (content) => asyncPostRequest(_create, '/api/cookbooks', content)
export const remove = (id) => asyncDeleteRequest(_remove, `/api/cookbooks/${id}`)
export const copy = (id) => asyncPostRequest(_copy, `/api/cookbooks/${id}/copy`)

export const modify = createAction('modify cookbook')
export const brew = (id) => asyncPostRequest(_brew, '/api/barista/brew', {id})
