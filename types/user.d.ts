export interface IUser {
    _id: string
    username: string
    avatar: string
    fullName: string
    phoneNumber: string
    createdTime: string
    role: Role
    status: number
    isOnline: boolean
    bio: string
    lastLogin: Date
    rooms: string[]
  }
  
  export interface Role {
    _id: string
    roleName: string
  }

export interface ICurrentUser {
    _id: string
    username: string
    avatar: string
    fullName: string
    phoneNumber?: string
    email?: string
    createdTime: Date
    status: number
    isOnline: boolean
    role: Role
    lastLogin: Date
    bio: string
    updatedTime: Date
    bufa?: string
    rooms: string[]
}