
export interface IAuther {
  see: boolean
  write: boolean
  must: boolean
}

export interface Irules {
  message: string
  type: string
  required?: boolean
}

export interface IOptions {
  [key: string]: string
}

export type Value = string | number

export interface IFormJsonItem {
  icon: string
  key: string
  model: string
  name?: string
  condition?: string
  options: IOptions
  rules: Array<Irules>
  type: string
  value: Value
}

export interface IOptionItem {
  value: string
  label: string
}
