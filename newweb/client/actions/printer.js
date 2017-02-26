import { RESTART_PRINTER } from '../constants'

function action(type, payload = {}) {
  return {type, ...payload}
}

export const restartPrinter = {
  request: () => action(RESTART_PRINTER.REQUEST),
  success: (payload) => action(RESTART_PRINTER.SUCCESS, payload),
  failter: (err) => action(RESTART_PRINTER.FAILURE)
}
