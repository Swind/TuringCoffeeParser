import * as React from "react";
import * as ReactDOM from "react-dom";

import { Process } from "../Api/cookbook";
import ProcessEditor from "./ProcessEditor";

const Anchor = require("grommet/components/Anchor");
const Table = require("grommet/components/Table");
const TableRow = require("grommet/components/TableRow");
const Menu = require("grommet/components/Menu");
const MoreIcon = require("grommet/components/icons/base/More");
const Layer = require("grommet/components/Layer");

interface ProcessTableProps {
  processes: Array<Process>;
  onChange: (processes: Array<Process>) => void;
}
interface ProcessTableStates {
  index: number;
  moving: number;
}

class ProcessTableItem extends React.Component<
  {
    process: Process;
    onEdit: () => void;
    onDelete: () => void;
    onDrag: (e: any) => void;
    onDragOver: (e: any) => void;
    onDrop: (e: any) => void;
    [propName: string]: any;
  },
  any
> {
  render() {
    const { process, onEdit, onDelete, ...props } = this.props;
    return (
      <TableRow {...props}>
        <td>
          {process.params.name !== undefined ? process.params.name : "-"}
        </td>
        <td>{process.water !== undefined ? process.water : "-"}</td>
        <td>{process.time !== undefined ? process.time : "-"}</td>
        <td>
          {process.params.temperature !== undefined
            ? process.params.temperature
            : "-"}
        </td>
        <td>
          <Menu responsive={true} icon={<MoreIcon />}>
            <Anchor onClick={onEdit}>
              Edit
            </Anchor>
            <Anchor onClick={onDelete}>
              Delete
            </Anchor>
          </Menu>
        </td>
      </TableRow>
    );
  }
}

export default class ProcessTable extends React.Component<
  ProcessTableProps,
  ProcessTableStates
> {
  constructor(props: ProcessTableProps) {
    super(props);
    this.state = { moving: -1, index: -1 };
    this.saveProcess = this.saveProcess.bind(this);
    this.closeProcessEditor = this.closeProcessEditor.bind(this);
  }

  private saveProcess(p: Process) {
    const { processes, onChange } = this.props;
    const processParams = processes.map((v: Process) => {
      return v.params;
    });
    processParams.splice(this.state.index, 1, p);
    onChange(processParams);
    this.closeProcessEditor();
  }

  private closeProcessEditor(): void {
    this.setState({ ...this.state, index: -1 });
  }

  private editProcess(index: number): void {
    this.setState({ ...this.state, index });
  }

  private deleteProcess(index: number): void {
    const { processes, onChange } = this.props;
    const processParams = processes.map((v: Process) => {
      return v.params;
    });
    processParams.splice(index, 1);
    onChange(processParams);
  }

  private moveProcess(from: number, to: number): void {
    const { processes, onChange } = this.props;
    const processParams = processes.map((v: Process) => {
      return v.params;
    });
    const f = processParams.splice(from, 1);
    processParams.splice(to, 0, ...f);
    onChange(processParams);
  }

  render() {
    const { processes } = this.props;
    const processRow = processes.map((p: Process, i: number) => {
      const onEdit = (): void => {
        this.editProcess(i);
      };
      const onDelete = (): void => {
        this.deleteProcess(i);
      };
      const onDrag = (e: any): void => {
        this.setState({ ...this.state, moving: i });
      };
      const onDragOver = (e: any): void => {
        e.preventDefault();
      };
      const onDrop = (e: any): void => {
        e.preventDefault();
        this.moveProcess(this.state.moving, i);
      };
      return (
        <ProcessTableItem
          key={i}
          process={p}
          onEdit={onEdit}
          onDelete={onDelete}
          onDrag={onDrag}
          onDragOver={onDragOver}
          onDrop={onDrop}
          draggable={true}
          style={{ cursor: "pointer" }}
        />
      );
    });

    return (
      <div>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Water (ml)</th>
              <th>Time (second)</th>
              <th>Temperature (°C)</th>
              <th>More</th>
            </tr>
          </thead>
          <tbody>
            {processRow}
          </tbody>
        </Table>
        {this.state.index >= 0 &&
          <Layer>
            <ProcessEditor
              process={processes[this.state.index]}
              save={this.saveProcess}
              cancel={this.closeProcessEditor}
            />
          </Layer>}
      </div>
    );
  }
}
