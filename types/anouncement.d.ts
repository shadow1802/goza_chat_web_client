export interface IAnouncement {
    _id: string
    createdBy: CreatedBy
    message: string
    file: string
    room: string
    createdAt: string
    updatedAt: string
  }
  
  export interface CreatedBy {
    _id: string
    username: string
    avatar: string
    fullName: string
  }