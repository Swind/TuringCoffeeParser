import { fork } from "redux-saga/effects";
import * as apiSaga from "./Api/apiDuck";

export default function* rootSaga() {
  yield [
    fork(apiSaga.watchListCookbooks),
    fork(apiSaga.watchGetCookbook),
    fork(apiSaga.watchSaveCookbook),
    fork(apiSaga.watchBrewCookbook),
    fork(apiSaga.watchGetMachineStatus),
    fork(apiSaga.watchRestartMachine),
    fork(apiSaga.watchSetTankTemperature)
  ];
}
