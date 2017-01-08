import { OPEN_SIDEBAR, CLOSE_SIDEBAR } from '../constants'

export function openSidebar() {
  return {
    type: OPEN_SIDEBAR
  }
}

export function closeSidebar() {
  return {
    type: CLOSE_SIDEBAR
  }
}
