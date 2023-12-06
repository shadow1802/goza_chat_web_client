export type Invition = {
    _id: string
    room: Room
    expiresAt: string
    createdAt: string
    updatedAt: string
    __v: number
  }
  
type Room = {
    _id: string
    roomName: string
    roomIcon: string
    roomUsers: string[]
  }