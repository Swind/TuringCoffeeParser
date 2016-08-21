import { createAction } from 'redux-actions'
import { asyncGetRequest, asyncPostRequest } from './asyncRequest'

const _getHeaterStatus = createAction('get heater status')
const _postHeaterStatus = createAction('update heater status')

export const getHeaterStatus = () => asyncGetRequest(_getHeaterStatus, '/api/heater')
export const postHeaterStatus = (content) => asyncPostRequest(_postHeaterStatus, '/api/heater', content)

