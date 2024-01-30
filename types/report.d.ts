export interface Report {
    _id: string
    target: Target
    createdBy: CreatedBy
    reportType: number
    message: Message
    reason: string
    isResolved: boolean
    createdAt: string
    updatedAt: string
    __v: number
  }
  
  export interface Target {
    _id: string
    username: string
    avatar: string
    fullName: string
  }
  
  export interface CreatedBy {
    _id: string
    username: string
    avatar: string
    fullName: string
  }
  
  export interface Message {
    _id: string
    message: string
    file: string
    room: string
    type: number
    createdTime: string
    lastModified: string
    reactions: any[]
    isDeleted: boolean
    tags: any[]
    createdBy: string
  }
  