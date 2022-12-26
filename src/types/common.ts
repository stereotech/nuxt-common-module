export type Common = {
  name: string
  helpers: any
  notify: any
}

export interface IParams {
  timezoneOffset?: number,
  apiUrl?: string,
  isPanel?: Boolean,
  [key: string]: any
}

export interface IPrinterInfo {
  axisMode?: string,
  printerName: string,
  printerState: string,
  printerIsPrinting: Boolean,
  currentExtruder: string,
  model: string,
  showSensor: Boolean,
  filamentPresent: Boolean,
  hasFilamentSensors: Boolean,
  [key: string]: any
}
