export interface IRoom {
    _id: string
    roomName: string
    roomIcon: string
    roomUsers: RoomUser[]
    key: string
    roomType: number
    lastMessage?: LastMessage
    unseenBy: number
  }
  
  export interface LastMessage {
    _id: string
    message: string
    lastModified: string
    isDeleted: boolean
    createdBy: CreatedBy
  }
  
  export interface CreatedBy {
    _id: string
    username: string
    avatar: string
    fullName: string
    phoneNumber: string
    createdTime: string
    status: number
    isOnline: boolean
    role: string
    lastLogin: string
    bio: string
    updatedTime: string
  }

  export interface RoomUser {
    _id: string
    user: User
    roomRole: number
  }