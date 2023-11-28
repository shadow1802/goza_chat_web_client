export interface IOutSide {
    message: string
    room: Room
    type: number
    createdTime: string
    lastModified: string
    reactions: any[]
    isDeleted: boolean
    _id: string
    createdBy: CreatedBy
    notify: Notify[],
    self?: boolean
  }
  
  export interface Room {
    _id: string
    roomName: string
    roomIcon: string
    roomType: number
  }
  
  export interface CreatedBy {
    _id: string
    username: string
    avatar: string
    fullName: string
  }
  
  export interface Notify {
    type: string
    content: string
    user: string
    isRead: boolean
    _id: string
    createdAt: string
    updatedAt: string
  }
  