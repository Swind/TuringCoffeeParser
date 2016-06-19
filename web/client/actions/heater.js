import { createAction } from 'redux-actions'
import { asyncGetRequest } from './asyncRequest'

const _getHeaterStatus = createAction('get heater status')
const _putHeaterStatus = createAction('update heater status')

export const getHeaterStatus = () => asyncGetRequest(_getHeaterStatus, '/api/heater')
export const putHeaterStatus = (content) => asyncPutRequest(_putHeaterStatus, '/api/heater')
