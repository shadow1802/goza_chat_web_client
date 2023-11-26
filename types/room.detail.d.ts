export interface IRoomDetail {
    _id: string
    roomName: string
    isActive: boolean
    roomIcon: string
    roomType: number
    roomUsers: RoomUser[]
    pinedChats: PinedChat[]
    bannedUsers: any[]
    unseenBy: string[]
    createdTime: string
    roomOwner: string
    key: string
    lastMessage: string
    updatedBy: string
    updatedTime: string
  }
  
  export interface RoomUser {
    _id: string
    user: User
    roomRole: number
  }
  
  export interface User {
    _id: string
    avatar: string
    fullName: string
    username?: string
  }
  
  export interface PinedChat {
    _id: string
    message: string
    room: string
    type: number
    createdTime: string
    lastModified: string
    reactions: any[]
    isDeleted: boolean
    createdBy: string
    file?: string
  }
  