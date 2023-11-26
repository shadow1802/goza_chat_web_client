export interface AuthState {
    user: User
    token: string
    expiredAt: string
  }
  
  export interface User {
    _id: string
    username: string
    password: string
    avatar: string
    fullName: string
    phoneNumber?: string
    email?: string
    createdTime: string
    status: number
    isOnline: boolean
    role: Role
    lastLogin: string
    bio: string
    updatedTime: string
    quickBlox: {
      accountId: string
      login: string
      password: string
    }
  }
  
  export interface Role {
    _id: string
    roleName: string
  }
  