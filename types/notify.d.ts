export interface INotify {
  _id: string
  type: string
  content: string
  user: string
  isRead: boolean
  createdAt: string
  updatedAt: string
}

export interface INotifyContentMessage {
  message: string
  createdBy: CreatedBy
  room: Room
}

export interface CreatedBy {
  _id: string
  username: string
  avatar: string
  fullName: string
}

export interface Room {
  _id: string
  roomName: string
  roomIcon: string
  roomType: number
}