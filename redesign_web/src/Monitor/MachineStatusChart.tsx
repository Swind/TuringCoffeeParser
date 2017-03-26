import * as React from "react";
import * as ReactDOM from "react-dom";

import { MachineStatus } from "./MonitorDuck";

const {
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer
} = require("recharts");

export interface MachineStatusChartProps {
  status: Array<MachineStatus>;
}

export default function MachineStatusChart(props: MachineStatusChartProps) {
  const data = props.status.map((s: MachineStatus) => {
    return {
      name: s.time,
      tankTemperature: s.tankTemperature,
      dutyCycle: s.dutyCycle,
      outputTemperature: s.outputTemperature,
      setPoint: s.setPoint
    };
  });

  return (
    <ResponsiveContainer width="100%" height={450}>
      <LineChart
        data={data}
        margin={{ top: 0, right: 0, left: 20, bottom: 0 }}
      >
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip isAnimationActive={false} />
        <Legend />
        <Line
          type="linear"
          dot={false}
          isAnimationActive={false}
          dataKey="setPoint"
          stroke="#ff324d"
        />
        <Line
          type="linear"
          dot={false}
          isAnimationActive={false}
          dataKey="tankTemperature"
          stroke="#00cceb"
        />
        <Line
          type="linear"
          dot={false}
          isAnimationActive={false}
          dataKey="dutyCycle"
          stroke="#ffd602"
        />
        <Line
          type="linear"
          dot={false}
          isAnimationActive={false}
          dataKey="outputTemperature"
          stroke="#ff7d28"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
