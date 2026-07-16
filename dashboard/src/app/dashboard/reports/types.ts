export interface BarGraphResponse {
  status: boolean
  message: string
  data: Data
  guard: string
  errors: null
  response_code: number
  request_body: null
}

export interface Data {
  graph: Graph
}

export interface Graph {
  references: References
  total: BarGraphData
  hourly: BarGraphData
  daily: BarGraphData
  weekly: BarGraphData
  monthly: BarGraphData
  yearly: BarGraphData
  custom: BarGraphData
}

export type BarGraphData = Record<string, number>

export type References = Record<
  string,
  {
    label: string
    color: string
  }
>
