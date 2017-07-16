import { createAction, Action } from "redux-actions";
import { call, put, takeEvery } from "redux-saga/effects";
import * as Api from "./api";

interface RequestType {
  REQUEST: string;
  SUCCESS: string;
  FAILURE: string;
}

function createApiRequestType(base: string): RequestType {
  return {
    REQUEST: `api/${base}_REQUEST`,
    SUCCESS: `api/${base}_SUCCESS`,
    FAILURE: `api/${base}_FAILURE`
  };
}

function createRequest(requestType: RequestType) {
  return {
    request: createAction(requestType.REQUEST),
    success: createAction(requestType.SUCCESS),
    failure: createAction(requestType.FAILURE)
  };
}

export const LIST_COOKBOOKS = createApiRequestType("LIST_COOKBOOKS");
export const listCookbooks = createRequest(LIST_COOKBOOKS);
export const GET_COOKBOOK = createApiRequestType("GET_COOKBOOK");
export const getCookbook = createRequest(GET_COOKBOOK);
export const SAVE_COOKBOOK = createApiRequestType("SAVE_COOKBOOK");
export const saveCookbook = createRequest(SAVE_COOKBOOK);
export const BREW_COOKBOOK = createApiRequestType("BREW_COOKBOOK");
export const brewCookbook = createRequest(BREW_COOKBOOK);
export const GET_MACHINE_STATUS = createApiRequestType("GET_MACHINE_STATUS");
export const getMachineStatus = createRequest(GET_MACHINE_STATUS);
export const RESTART_MACHINE = createApiRequestType("RESTART_MACHINE");
export const restartMachine = createRequest(RESTART_MACHINE);
export const SET_TANK_TEMPERATURE = createApiRequestType(
  "SET_TANK_TEMPERATURE"
);
export const setTankTemperature = createRequest(SET_TANK_TEMPERATURE);

// redux-saga
function* tryListCookbooks() {
  try {
    const resp = yield call(Api.listCookbooks);
    if (resp.status === 200) {
      yield put(listCookbooks.success(resp));
    } else {
      yield put(listCookbooks.failure(resp));
    }
  } catch (err) {
    yield put(listCookbooks.failure(err));
  }
}

function* tryGetCookbook(action: Action<any>) {
  try {
    const resp = yield call(Api.getCookbook, action.payload);
    if (resp.status === 200) {
      yield put(getCookbook.success(resp));
    } else {
      yield put(getCookbook.failure(resp));
    }
  } catch (err) {
    yield put(getCookbook.failure(err));
  }
}

function* trySaveCookbook(action: Action<any>) {
  try {
    const resp = yield call(Api.saveCookbook, action.payload);
    if (resp.status === 200) {
      yield put(saveCookbook.success(resp));
    } else {
      yield put(saveCookbook.failure(resp));
    }
  } catch (err) {
    yield put(saveCookbook.failure(err));
  }
}

function* tryBrewCookbook(action: Action<any>) {
  try {
    const resp = yield call(Api.brewCookbook, action.payload);
    if (resp.status === 200) {
      yield put(brewCookbook.success(resp));
    } else {
      yield put(brewCookbook.failure(resp));
    }
  } catch (err) {
    yield put(brewCookbook.failure(err));
  }
}

function* tryGetMachineStatus(action: Action<any>) {
  try {
    const resp = yield call(Api.getHeater);
    if (resp.status === 200) {
      yield put(getMachineStatus.success(resp));
    } else {
      yield put(getMachineStatus.failure(resp));
    }
  } catch (err) {
    yield put(getMachineStatus.failure(err));
  }
}

function* tryRestartMachine(action: Action<any>) {
  try {
    let resp = yield call(Api.stopPrinter);
    if (resp.status !== 200) {
      yield put(getMachineStatus.failure(resp));
      return;
    }
    resp = yield call(Api.startPrinter);
    if (resp.status !== 200) {
      yield put(getMachineStatus.failure(resp));
    }
  } catch (err) {
    yield put(getMachineStatus.failure(err));
  }
}

function* trySetTankTemperature(action: Action<any>) {
  try {
    let resp = yield call(Api.setTargetPoint, action.payload);
    if (resp.status !== 200) {
      yield put(setTankTemperature.failure(resp));
    }
  } catch (err) {
    yield put(setTankTemperature.failure(err));
  }
}

export function* watchListCookbooks() {
  yield takeEvery(LIST_COOKBOOKS.REQUEST, tryListCookbooks);
}

export function* watchGetCookbook() {
  yield takeEvery(GET_COOKBOOK.REQUEST, tryGetCookbook);
}

export function* watchSaveCookbook() {
  yield takeEvery(SAVE_COOKBOOK.REQUEST, trySaveCookbook);
}

export function* watchBrewCookbook() {
  yield takeEvery(BREW_COOKBOOK.REQUEST, tryBrewCookbook);
}

export function* watchGetMachineStatus() {
  yield takeEvery(GET_MACHINE_STATUS.REQUEST, tryGetMachineStatus);
}

export function* watchRestartMachine() {
  yield takeEvery(RESTART_MACHINE.REQUEST, tryRestartMachine);
}

export function* watchSetTankTemperature() {
  yield takeEvery(SET_TANK_TEMPERATURE.REQUEST, trySetTankTemperature);
}
