import { put, call, fork } from 'redux-saga/effects'
import { takeEvery } from 'redux-saga'
import { listCookbook, getCookbook, saveCookbook, brewCookbook, saveNewCookbook, deleteCookbook, copyCookbook } from '../actions/cookbook'
import { getHeater, setTargetPoint } from '../actions/heater'
import { restartPrinter } from '../actions/printer'
import { LIST_COOKBOOK, GET_COOKBOOK, SAVE_COOKBOOK, DELETE_COOKBOOK, BREW_COOKBOOK, GET_HEATER, SAVE_NEW_COOKBOOK, COPY_COOKBOOK, SET_TARGET_POINT, RESTART_PRINTER } from '../constants'
import Api from '../api'

export function* fetchCookbooks(action) {
  try {
    const res = yield call(Api.listCookbook)
    if (res.status === 200) {
      yield put(listCookbook.success(res.body.data))
    } else {
      yield put(listCookbook.failure(res.status))
    }
  } catch (err) {
    yield put(listCookbook.failure(err))
  }
}

export function* fetchCookbook(action) {
  try {
    const res = yield call(Api.getCookbook, action.id)
    if (res.status === 200) {
      yield put(getCookbook.success(res.body.data))
    } else {
      yield put(getCookbook.failure(res.status))
    }
  } catch (err) {
    yield put(getCookbook.failure(err))
  }
}

export function* updateCookbook(action) {
  try {
    const res = yield call(Api.saveCookbook, action.id, action.cookbook)
    if (res.status === 200) {
      yield put(saveCookbook.success())
    } else {
      yield put(saveCookbook.failure(res.status))
    }
  } catch (err) {
    yield put(saveCookbook.failure(err))
  }
}

export function* tryBrewCookbook(action) {
  try {
    const res = yield call(Api.brewCookbook, action.id)
    if (res.status === 200) {
      yield put(brewCookbook.success())
    } else {
      yield put(beweCookbook.failure(res.status))
    }
  } catch (err) {
    yield put(brewCookbook.failure(err))
  }
}

export function* tryGetHeater(action) {
  try {
    const res = yield call(Api.getHeater)
    if (res.status === 200) {
      yield put(getHeater.success(res.body.data))
    } else {
      yield put(getHeater.failure(res.status))
    }
  } catch (err) {
    yield put(getHeater.failure(err))
  }
}

export function* trySaveNewCookbook(action) {
  try {
    const cookbook = {name: action.name, description: action.description, processes: []}
    const res = yield call(Api.newCookbook, cookbook)
    if (res.status === 200) {
      yield put(saveNewCookbook.success(res.body.data))
      yield fetchCookbooks(action)
    } else {
      yield put(saveNewCookbook.failure(res.status))
    }
  } catch (err) {
    yield put(saveNewCookbook.failure(err))
  }
}

export function* tryDeleteCookbook(action) {
  try {
    const res = yield call(Api.deleteCookbook, action.id)
    if (res.status === 200) {
      yield put(deleteCookbook.success(res.body.data))
      yield fetchCookbooks(action)
    } else {
      yield put(deleteCookbook.failure(res.status))
    }
  } catch (err) {
    yield put(deleteCookbook.failure(err))
  }
}

export function* tryCopyCookbook(action) {
  try {
    const res = yield call(Api.copyCookbook, action.id)
    if (res.status === 200) {
      yield put(copyCookbook.success(res.body.data))
      yield fetchCookbooks(action)
    } else {
      yield put(copyCookbook.failure(res.status))
    }
  } catch (err) {
    yield put(copyCookbook.failure(err))
  }
}

export function* trySetTargetPoint(action) {
  try {
    const res = yield call(Api.setTargetPoint, action.temperature)
    if (res.status === 200) {
      yield put(setTargetPoint.success(res.body.data))
    } else {
      yield put(setTargetPoint.failure(res.status))
    }
  } catch (err) {
    yield put(setTargetPoint.failure(err))
  }
}

export function* tryRestartPrinter(action) {
  try {
    const res = yield call(Api.stopPrinter)
    if (res.status === 200) {
      yield put(restartPrinter.success(res.body.data))
      yield call(Api.startPrinter)
    } else {
      yield put(restartPrinter.failure(res.status))
    }
  } catch (err) {
    yield put(restartPrinter.failure(err))
  }
}


export function* watchListCookbooks() {
  yield takeEvery(LIST_COOKBOOK.REQUEST, fetchCookbooks)
}

export function* watchGetCookbook() {
  yield takeEvery(GET_COOKBOOK.REQUEST, fetchCookbook)
}

export function* watchSaveCookbook() {
  yield takeEvery(SAVE_COOKBOOK.REQUEST, updateCookbook)
}

export function* watchBrewCookbook() {
  yield takeEvery(BREW_COOKBOOK.REQUEST, tryBrewCookbook)
}

export function* watchGetHeater() {
  yield takeEvery(GET_HEATER.REQUEST, tryGetHeater)
}

export function* watchSaveNewCookbook() {
  yield takeEvery(SAVE_NEW_COOKBOOK.REQUEST, trySaveNewCookbook)
}

export function* watchDeleteCookbook() {
  yield takeEvery(DELETE_COOKBOOK.REQUEST, tryDeleteCookbook)
}

export function* watchCopyCookbook() {
  yield takeEvery(COPY_COOKBOOK.REQUEST, tryCopyCookbook)
}

export function* watchSetTargetPoint() {
  yield takeEvery(SET_TARGET_POINT.REQUEST, trySetTargetPoint)
}

export function* watchRestartPrinter() {
  yield takeEvery(RESTART_PRINTER.REQUEST, tryRestartPrinter)
}

export default function* root() {
  yield [
    fork(watchListCookbooks),
    fork(watchGetCookbook),
    fork(watchSaveCookbook),
    fork(watchBrewCookbook),
    fork(watchGetHeater),
    fork(watchSaveNewCookbook),
    fork(watchDeleteCookbook),
    fork(watchCopyCookbook),
    fork(watchSetTargetPoint),
    fork(watchRestartPrinter)
  ]
}

