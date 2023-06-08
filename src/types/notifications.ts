export type MessageType = 'success' | 'info' | 'error' | 'warning'

export interface Message {
  type: MessageType
  text: string
  dialog?: boolean
  actions?: MessageAction[]
  timeout?: number
}

export interface MessageAction {
  text: string,
  onClick: (e: any) => void,
  closeOnClick?: boolean
}
