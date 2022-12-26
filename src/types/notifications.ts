export type MessageType = 'success' | 'info' | 'error' | 'warning'

export interface Message {
  type: MessageType
  text: string
  actions?: MessageAction[]
  timeout?: number
}

export interface MessageAction {
  text: string,
  onClick: (e: any) => void,
  closeOnClick?: boolean
}