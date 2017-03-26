const process = require("turing-coffee-process/processes/process");

export type Temperature = number;
export type Cylinder = number;
export type TotalWater = number;
export type TotalTime = number;
export type Feedrate = number;

export interface Coordinates {
  x: number;
  y: number;
}

export interface Radius {
  start: number;
  end?: number;
}

export interface High {
  start: number;
  end?: number;
}

export interface Process {
  params: any;
  time: number;
  water: number;
  coordinates?: Coordinates;
  radius?: Radius;
  high?: High;
  temperature?: Temperature;
  cylinder?: Cylinder;
  total_water?: TotalWater;
  total_time?: TotalTime;
  feedrate?: Feedrate;
}

export interface CookbookParams {
  _id: string;
  name: string;
  description: string;
  processes: Array<Process>;
}

export class Cookbook {
  private _params: CookbookParams;
  private _processes: Array<Process>;

  constructor(params: CookbookParams) {
    this._params = params;
    this._processes = params.processes.map((p: Process) => {
      return process.createProcess(p);
    });
  }

  get id(): string {
    return this._params._id;
  }

  set id(_id: string) {
    this._params._id = _id;
  }

  get name(): string {
    return this._params.name;
  }

  set name(_name: string) {
    this._params.name = name;
  }

  get description(): string {
    return this._params.description;
  }

  set description(_desc: string) {
    this._params.description = _desc;
  }

  get totalTime(): number {
    return this._processes.reduce((acc, p) => {
      return acc + p.time;
    }, 0);
  }

  get totalWater(): number {
    return this._processes.reduce((acc, p) => {
      return acc + p.water;
    }, 0);
  }

  get processes(): Array<Process> {
    return this._processes;
  }
}
