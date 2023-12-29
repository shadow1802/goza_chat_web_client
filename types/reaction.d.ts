export interface Reaction {
    emoji: string
    message: Message
    roomId: string
  }
  
  export interface Message {
    _id: string
    message: string
    room: string
    type: number
    createdTime: string
    lastModified: string
    reactions: Reaction[]
    isDeleted: boolean
    tags: any[]
    createdBy: string
  }
  
  export interface Reaction {
    _id: string
    emoji: string
    createdTime: string
    createdBy: { _id: string }
  }
  