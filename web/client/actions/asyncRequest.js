import request from 'superagent'

export const asyncGetRequest = (action, path) => dispatch => {
    request
      .get(path)
      .set('Accept', 'application/json')
      .end((err, res) =>
        dispatch((err)? action(err): action(res))
       )
  }

export const asyncPostRequest = (action, path, content) => dispatch => {
    request
      .post(path)
      .send(content)
      .set('Accept', 'application/json')
      .end()
  }

export const asyncPutRequest = (action, path, content) => dispatch => {
    request
      .put(path)
      .send(content)
      .set('Accept', 'application/json')
      .end((err, res) =>
        dispatch((err)? action(err): action(res))
      )
  }

export const asyncDeleteRequest = (action, path) => dispatch => {
    request
      .delete(path)
      .set('Accept', 'application/json')
      .end((err, res) =>
        dispatch((err)? action(err): action(res))
      )
  }
