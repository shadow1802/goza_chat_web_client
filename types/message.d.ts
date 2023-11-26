export interface IMessage {
    _id: string
    message: string
    room: { _id: string, roomName: string, roomIcon: string, roomType: number }
    type: number
    file: string
    createdTime: Date
    lastModified: Date
    reactions: Object[]
    isDeleted: false
    createdBy: {
        _id: string,
        avatar: string
        fullName: string
    }
}