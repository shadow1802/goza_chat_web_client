"use client"
import { useLobbyContext } from "@/context/Lobby.context"
import { IRoom } from "@/types/room"
import { IUser } from "@/types/user"
import { FC } from "react"
type Props = {
    user: { username: string, fullName: string, avatar: string, _id: string }
    [key: string]: any
}

const UserCard: FC<Props> = ({ user, ...rest }) => {

    const { rooms } = useLobbyContext()

    const LOL = rooms.filter(item => item.roomType === 0)

    const chatInfo = LOL.find((room: IRoom) => room?.key?.includes(user._id))

    return <div {...rest} className="group cursor-pointer flex items-center space-x-2 hover:bg-sky-500 px-4 py-2">

        { user.avatar ? <img src={user.avatar} className="rounded-full w-10 h-10"/> : <img src="/images/default-avatar.jpg" className="border-2 rounded-full w-10 h-10"/> }

        <div>
            <p className="text-sky-500 group-hover:text-white text-[0.89rem] font-semibold">{user.fullName}</p>
            { chatInfo && <p className="text-xs text-gray-500 group-hover:text-white">
                { chatInfo.lastMessage && `Tin nhắn mới: ${chatInfo.lastMessage.message || '(trống)' }` }
            </p>}
        </div>
    </div>
}

export default UserCard