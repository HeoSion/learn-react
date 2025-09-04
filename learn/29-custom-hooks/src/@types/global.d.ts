export type Timeout = ReturnType<typeof setTimeout> | number | undefined

export type Status = 'idle' | 'pending' | 'resolved' | 'rejected'

export interface State<DataType, ErrorType = Error> {
  status: Status
  error: null | ErrorType
  data: null | DataType
}
