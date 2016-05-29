import { createAction } from 'redux-actions'
import { asyncGetRequest } from './asyncRequest'

const _getHeaterStatus = createAction('get heater status')

export const getHeaterStatus = () => asyncGetRequest(_getHeaterStatus, '/api/heater')
