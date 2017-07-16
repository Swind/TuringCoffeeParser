import * as React from "react";
import * as ReactDOM from "react-dom";

import {
  Coordinates,
  Cylinder,
  Feedrate,
  High,
  Process,
  Radius,
  Temperature,
  TotalTime,
  TotalWater
} from "../Api/cookbook";

const {
  getProcessDefaultParams
} = require("turing-coffee-process/processes/process");

const Form = require("grommet/components/Form");
const FormField = require("grommet/components/FormField");
const Table = require("grommet/components/Table");
const TableRow = require("grommet/components/TableRow");
const NumberInput = require("grommet/components/NumberInput");
const Select = require("grommet/components/Select");
const Button = require("grommet/components/Button");
const SaveIcon = require("grommet/components/icons/base/Save");
const CloseIcon = require("grommet/components/icons/base/Close");

interface OnChangeEvent {
  target: {
    value: number;
  };
}

function CoordinatesEditor(
  coordinates: Coordinates,
  onChange: (v: Coordinates) => void
) {
  const onXChange = (e: OnChangeEvent): void => {
    onChange(Object.assign({}, coordinates, { x: e.target.value }));
  };
  const onYChange = (e: OnChangeEvent): void => {
    onChange(Object.assign({}, coordinates, { y: e.target.value }));
  };

  return (
    <FormField label="(x, y)">
      <NumberInput
        value={coordinates.x}
        min={-100}
        max={100}
        onChange={onXChange}
      />
      <NumberInput
        value={coordinates.y}
        min={-100}
        max={100}
        onChange={onYChange}
      />
    </FormField>
  );
}

function RadiusEditor(radius: Radius, onChange: (v: Radius) => void) {
  const onStartChange = (e: OnChangeEvent): void => {
    onChange(Object.assign({}, radius, { start: e.target.value }));
  };

  const onEndChange = (e: OnChangeEvent): void => {
    onChange(Object.assign({}, radius, { end: e.target.value }));
  };

  if (radius.end) {
    return (
      <FormField label="Radius (from->to)">
        <NumberInput
          value={radius.start}
          min={0}
          max={100}
          onChange={onStartChange}
        />
        <NumberInput
          value={radius.end}
          min={0}
          max={100}
          onChange={onEndChange}
        />
      </FormField>
    );
  } else {
    return (
      <FormField label="Radius">
        <NumberInput
          value={radius.start}
          min={0}
          max={100}
          onChange={onStartChange}
        />
      </FormField>
    );
  }
}

function HighEditor(high: High, onChange: (v: High) => void) {
  const onStartChange = (e: OnChangeEvent): void => {
    onChange(Object.assign({}, high, { start: e.target.value }));
  };

  const onEndChange = (e: OnChangeEvent): void => {
    onChange(Object.assign({}, high, { end: e.target.value }));
  };

  if (high.end) {
    return (
      <FormField label="High (from->to)">
        <NumberInput
          value={high.start}
          min={0}
          max={200}
          onChange={onStartChange}
        />
        <NumberInput
          value={high.end}
          min={0}
          max={200}
          onChange={onEndChange}
        />
      </FormField>
    );
  } else {
    return (
      <FormField label="High">
        <NumberInput
          value={high.start}
          min={0}
          max={200}
          onChange={onStartChange}
        />
      </FormField>
    );
  }
}

function TemperatureEditor(
  temperature: Temperature,
  onChange: (v: Temperature) => void
) {
  const onTemperatureChange = (e: OnChangeEvent): void => {
    onChange(e.target.value);
  };
  return (
    <FormField label="Temperature">
      <NumberInput
        value={temperature}
        min={0}
        max={100}
        onChange={onTemperatureChange}
      />
    </FormField>
  );
}

function CylinderEditor(cylinder: Cylinder, onChange: (v: Cylinder) => void) {
  const onCylinderChange = (e: OnChangeEvent): void => {
    onChange(e.target.value);
  };
  return (
    <FormField label="Cylinder">
      <NumberInput
        value={cylinder}
        min={0}
        max={20}
        onChange={onCylinderChange}
      />
    </FormField>
  );
}

function TotalWaterEditor(
  totalWater: TotalWater,
  onChange: (v: TotalWater) => void
) {
  const onTotalWaterChange = (e: OnChangeEvent): void => {
    onChange(e.target.value);
  };
  return (
    <FormField label="Total Water">
      <NumberInput
        value={totalWater}
        min={0}
        max={1000}
        onChange={onTotalWaterChange}
      />
    </FormField>
  );
}

function TotalTimeEditor(
  totalTime: TotalTime,
  onChange: (v: TotalTime) => void
) {
  const onTotalTimeChange = (e: OnChangeEvent): void => {
    onChange(e.target.value);
  };
  return (
    <FormField label="Total Time">
      <NumberInput
        value={totalTime}
        min={0}
        max={1000}
        onChange={onTotalTimeChange}
      />
    </FormField>
  );
}

function FeedrateEditor(feedrate: Feedrate, onChange: (v: Feedrate) => void) {
  const onFeedrateChange = (e: OnChangeEvent): void => {
    onChange(e.target.value);
  };
  return (
    <FormField label="Feedrate">
      <NumberInput
        value={feedrate}
        min={0}
        max={1000}
        onChange={onFeedrateChange}
      />
    </FormField>
  );
}

interface ProcessEditorProps {
  process: Process;
  save: (p: Process) => void;
  cancel: () => void;
}

interface ProcessEditorStates {
  process: Process;
  unionProcess: Process;
}

export default class ProcessEditor extends React.Component<
  ProcessEditorProps,
  any
> {
  constructor(props: ProcessEditorProps) {
    super(props);
    this.state = {
      process: Object.assign({}, props.process.params),
      unionProcess: Object.assign({}, props.process.params)
    };

    this.onCoordinatesChange = this.onCoordinatesChange.bind(this);
    this.onRadiusChange = this.onRadiusChange.bind(this);
    this.onHighChange = this.onHighChange.bind(this);
    this.onTemperatureChange = this.onTemperatureChange.bind(this);
    this.onCylinderChange = this.onCylinderChange.bind(this);
    this.onTotalWaterChange = this.onTotalWaterChange.bind(this);
    this.onTotalTimeChange = this.onTotalTimeChange.bind(this);
    this.onFeedrateChange = this.onFeedrateChange.bind(this);
    this.onProcessChange = this.onProcessChange.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  private onCoordinatesChange(v: Coordinates): void {
    this.setState({
      ...this.state,
      process: Object.assign(this.state.process, { coordinates: v })
    });
  }

  private onRadiusChange(v: Radius): void {
    this.setState({
      ...this.state,
      process: Object.assign(this.state.process, { radius: v })
    });
  }

  private onHighChange(v: High): void {
    this.setState({
      ...this.state,
      process: Object.assign(this.state.process, { high: v })
    });
  }

  private onTemperatureChange(v: Temperature): void {
    this.setState({
      ...this.state,
      process: Object.assign(this.state.process, { temperature: v })
    });
  }

  private onCylinderChange(v: Cylinder): void {
    this.setState({
      ...this.state,
      process: Object.assign(this.state.process, { cylinder: v })
    });
  }

  private onTotalWaterChange(v: TotalWater): void {
    this.setState({
      ...this.state,
      process: Object.assign(this.state.process, { total_water: v })
    });
  }

  private onTotalTimeChange(v: TotalTime): void {
    this.setState({
      ...this.state,
      process: Object.assign(this.state.process, { total_time: v })
    });
  }

  private onFeedrateChange(v: Feedrate): void {
    this.setState({
      ...this.state,
      process: Object.assign(this.state.process, { feedrate: v })
    });
  }

  private onProcessChange(v: any) {
    const unionProcess = Object.assign(
      this.state.unionProcess,
      this.state.process
    );
    const newProcess = getProcessDefaultParams(v.value.value);

    if (newProcess.coordinates && unionProcess.coordinates) {
      newProcess.coordinates = Object.assign(
        newProcess.coordinates,
        unionProcess.coordinates
      );
    }
    if (newProcess.radius && unionProcess.radius) {
      newProcess.radius = Object.assign(newProcess.radius, unionProcess.radius);
    }
    if (newProcess.high && unionProcess.high) {
      newProcess.high = Object.assign(newProcess.high, unionProcess.high);
    }
    if (newProcess.temperature && unionProcess.temperature) {
      newProcess.temperature = Object.assign(
        newProcess.temperature,
        unionProcess.temperature
      );
    }
    if (newProcess.cylinder && unionProcess.cylinder) {
      newProcess.cylinder = Object.assign(
        newProcess.cylinder,
        unionProcess.cylinder
      );
    }
    if (newProcess.total_water && unionProcess.total_water) {
      newProcess.total_water = Object.assign(
        newProcess.total_water,
        unionProcess.total_water
      );
    }
    if (newProcess.total_time && unionProcess.total_time) {
      newProcess.total_time = Object.assign(
        newProcess.total_time,
        unionProcess.total_time
      );
    }
    if (newProcess.feedrate && unionProcess.feedrate) {
      newProcess.feedrate = Object.assign(
        newProcess.feedrate,
        unionProcess.feedrate
      );
    }
    this.setState({
      process: newProcess,
      unionProcess: unionProcess
    });
  }

  private onSave() {
    const { save } = this.props;
    save(this.state.process);
  }

  render() {
    const { cancel } = this.props;
    const process = this.state.process;

    const coordinates = process.coordinates
      ? CoordinatesEditor(
          process.coordinates,
          this.onCoordinatesChange
        )
      : null;

    const radius = process.radius
      ? RadiusEditor(process.radius, this.onRadiusChange)
      : null;

    const high = process.high
      ? HighEditor(process.high, this.onHighChange)
      : null;

    const temperature = process.temperature
      ? TemperatureEditor(
          process.temperature,
          this.onTemperatureChange
        )
      : null;

    const cylinder = process.cylinder
      ? CylinderEditor(process.cylinder, this.onCylinderChange)
      : null;

    const total_water = process.total_water
      ? TotalWaterEditor(
          process.total_water,
          this.onTotalWaterChange
        )
      : null;

    const total_time = process.total_time
      ? TotalTimeEditor(process.total_time, this.onTotalTimeChange)
      : null;

    const feedrate = process.feedrate
      ? FeedrateEditor(process.feedrate, this.onFeedrateChange)
      : null;

    return (
      <div>
        <Form>
          <FormField>
            <Select
              inline={false}
              options={[
                { label: "Circle", value: "circle" },
                { label: "Fixed Point", value: "fixed_point" },
                { label: "Spiral", value: "spiral" },
                { label: "Spiral Total Water", value: "spiral total water" },
                { label: "Wait", value: "wait" },
                { label: "Home", value: "home" },
                { label: "Move", value: "move" },
                { label: "Calibration", value: "calibration" },
                { label: "Mix", value: "mix" }
              ]}
              value={process.name}
              onChange={this.onProcessChange}
            />
          </FormField>
          {coordinates}
          {radius}
          {high}
          {temperature}
          {cylinder}
          {total_water}
          {total_time}
          {feedrate}
          <div>
            <Button
              icon={<SaveIcon />}
              label="Save"
              onClick={this.onSave}
            />
            <Button icon={<CloseIcon />} label="Exit" onClick={cancel} />
          </div>
        </Form>
      </div>
    );
  }
}
