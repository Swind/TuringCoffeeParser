import { Record, List } from "immutable";
import { createAction, Action } from "redux-actions";
import { GET_MACHINE_STATUS, getMachineStatus } from "../Api/apiDuck";

export interface MachineStatus {
  time: string;
  tankTemperature: number;
  dutyCycle: number;
  outputTemperature: number;
  setPoint: number;
}

export const INITIAL_STATE = Record({
  timer: null,
  loading: true,
  result: false,
  status: [],
  setPoint: null
});

export const CLEAR_MACHINE_STATUS_HISTORY =
  "Monitor/CLEAR_MACHINE_STATUS_HISTORY";
export const clearMachineStatusHistory = createAction(
  CLEAR_MACHINE_STATUS_HISTORY
);

export function monitorReducer(
  state = new INITIAL_STATE(),
  action: Action<any>
) {
  switch (action.type) {
    case GET_MACHINE_STATUS.SUCCESS: {
      const status = state.get("status").slice();
      status.push({
        time: "",
        tankTemperature: action.payload.body.data.temperature,
        dutyCycle: action.payload.body.data.duty_cycle,
        outputTemperature: action.payload.body.data.output_temperature,
        setPoint: action.payload.body.data.set_point
      });
      if (status.length > 600) {
        status.splice(0, 1);
      }

      let newState = state;
      if (!state.get("setPoint")) {
        newState = state.set("setPoint", action.payload.body.data.set_point);
      }
      return newState
        .set("status", status)
        .set("loading", false)
        .set("result", true);
    }
    case GET_MACHINE_STATUS.FAILURE:
      return state.set("loading", false).set("result", false);
    case CLEAR_MACHINE_STATUS_HISTORY: {
      const status = state.get("status").pop();
      return state.set("status", [status]);
    }
    default:
      return state;
  }
}
