import { createAction } from 'redux-actions'
import request from 'superagent'

const asyncGetRequest = (action, path) => dispatch => {
    request
      .get(path)
      .set('Accept', 'application/json')
      .end((err, res) =>
        dispatch((err)? action(err): action(res))
       )
  }

const asyncPutRequest = (action, path, content) => dispatch => {
    request
      .put(path)
      .send(content)
      .set('Accept', 'application/json')
      .end((err, res) =>
        disaptch((err)? action(err): action(res))
      )
  }

const _list = createAction('list cookbooks')
const _load = createAction('load cookbook')
const _save = createAction('save cookbook')

export const list = () => asyncGetRequest(_list, '/api/cookbooks')
export const load = id => asyncGetRequest(_load, `/api/cookbooks/${id}`)
export const save = (id, content) => asyncPutRequest(_save, `/api/cookbooks/${id}`, content)
