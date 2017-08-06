import * as React from "react";
import * as ReactDOM from "react-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  getMachineStatus,
  restartMachine,
  setTankTemperature
} from "../Api/apiDuck";
import MachineStatusChart from "./MachineStatusChart";
import { MachineStatus, clearMachineStatusHistory } from "./MonitorDuck";

const Columns = require("grommet/components/Columns");
const Box = require("grommet/components/Box");
const Meter = require("grommet/components/Meter");
const Label = require("grommet/components/Label");
const Value = require("grommet/components/Value");
const Button = require("grommet/components/Button");
const Toast = require("grommet/components/Toast");

const Form = require("grommet/components/Form");
const FormField = require("grommet/components/FormField");
const FormFields = require("grommet/components/FormFields");
const NumberInput = require("grommet/components/NumberInput");

interface StateProps {
  loading: boolean;
  result: boolean;
  status: Array<MachineStatus>;
  setPoint: number;
}

interface DispatchProps {
  getMachineStatus: () => void;
  clearMachineStatusHistory: () => void;
  restartMachine: () => void;
  setTankTemperature: (temperature: number) => void;
}

type MonitorProps = StateProps & DispatchProps;

function mapStateToProps(state: any): StateProps {
  return {
    loading: state.monitor.loading,
    result: state.monitor.result,
    status: state.monitor.status,
    setPoint: state.monitor.setPoint
  };
}

function mapDispatchToProps(dispatch: any) {
  return bindActionCreators(
    {
      getMachineStatus: getMachineStatus.request,
      clearMachineStatusHistory: clearMachineStatusHistory,
      restartMachine: restartMachine.request,
      setTankTemperature: setTankTemperature.request
    },
    dispatch
  );
}

function MonitorMeter(props: {
  value: number;
  threshold?: number;
  max: number;
  min: number;
  unit: string;
  label: string;
}) {
  const label = (
    <Label size="small">
      {props.label}
    </Label>
  );

  if (isFinite(props.value)) {
    return <Box align="center">
      <Meter type="bar" value={props.value} threshold={props.threshold} />
      {label}
      <Box direction="row" justify="between" align="center">
        <Value value={props.value.toFixed(2)} size="small" units={props.unit} />
      </Box>
    </Box>;
  }

  return null;
}

class Monitor extends React.Component<MonitorProps, any> {
  componentWillMount() {
    this.props.getMachineStatus();
    this.setState({
      ...this.state,
      timer: setInterval(() => this.props.getMachineStatus(), 2000)
    });
    this.changeSetPoint = this.changeSetPoint.bind(this);
    this.submitSetPoint = this.submitSetPoint.bind(this);
  }

  componentWillUnmount() {
    clearInterval(this.state.timer);
  }

  changeSetPoint(e: any) {
    this.setState({ ...this.state, setPoint: e.target.value });
  }

  submitSetPoint() {
    if (this.state) {
      this.props.setTankTemperature(this.state.setPoint);
    }
  }

  render() {
    const { status } = this.props;
    const setPoint =
      this.state && this.state.setPoint
        ? this.state.setPoint
        : this.props.setPoint;
    const lastStatus = status.length > 0 ? status[status.length - 1] : null;
    return (
      <div>
        {lastStatus &&
          <Columns size="large" justify="center" masonry={false}>
            <Box>
              <MachineStatusChart status={status} />
            </Box>
            <Box align="center">
              <MonitorMeter
                label="Tank Temperature"
                value={lastStatus.tankTemperature}
                min={0}
                max={100}
                unit="°C"
              />
              <MonitorMeter
                label="Output Temperature"
                value={lastStatus.outputTemperature}
                min={0}
                max={100}
                unit="°C"
              />
              <MonitorMeter
                label="Duty Cycle"
                value={lastStatus.dutyCycle}
                min={0}
                max={100}
                unit="%"
              />
              <div>
                <Form compact={true}>
                  <FormField label="Set Point">
                    <NumberInput
                      value={setPoint}
                      onChange={this.changeSetPoint}
                    />
                  </FormField>
                  <Button label="Set" onClick={this.submitSetPoint} />
                </Form>
              </div>
            </Box>
          </Columns>}
        <Box separator="top">
          <Button
            label="Clear history"
            onClick={this.props.clearMachineStatusHistory}
          />
          <Button label="Restart machine" onClick={this.props.restartMachine} />
        </Box>
      </div>
    );
  }
}

export default connect<StateProps, DispatchProps, any>(
  mapStateToProps,
  mapDispatchToProps
)(Monitor);
