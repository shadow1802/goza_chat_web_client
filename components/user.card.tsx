"use client"
import { useLobbyContext } from "@/context/Lobby.context"
import { useSocket } from "@/context/Socket.context"
import { IRoom } from "@/types/room"
import { IUser } from "@/types/user"
import useInvoker from "@/utils/useInvoker"
import { FC } from "react"
type Props = {
    user: { username: string, fullName: string, avatar: string, _id: string }
    isFriend?: boolean
    [key: string]: any
}

const UserCard: FC<Props> = ({ user, isFriend, ...rest }) => {

    const { rooms } = useLobbyContext()
    const { socket } = useSocket()
    const invoker = useInvoker()

    const handleDeteleFriend = async () => {
        const { data, status, message } = await invoker.remove(`/friend/deleteFriend/${user._id}`)

        if (status === 200) {
            socket.emit("delete_friend", { fromUserObject: data.from, toUserObject: data.to })
        }
    }

    const LOL = rooms.filter(item => item.roomType === 0)

    const chatInfo = LOL.find((room: IRoom) => room?.key?.includes(user._id))

    return <div {...rest} className="group cursor-pointer flex justify-between items-center hover:bg-sky-500 px-4 py-2">

        <div className="flex space-x-4">
            {user.avatar ? <img src={user.avatar} className="rounded-full w-10 h-10" /> : <img src="/images/default-avatar.jpg" className="border-2 rounded-full w-10 h-10" />}

            <div>
                <p className="text-sky-500 group-hover:text-white text-[0.89rem] font-semibold">{user.fullName}</p>
                {chatInfo && <p className="text-xs text-gray-500 group-hover:text-white">
                    {chatInfo.lastMessage && `Tin nhắn mới: ${chatInfo.lastMessage.message || '(trống)'}`}
                </p>}
            </div>
        </div>

        { isFriend && <div onClick={e => e.stopPropagation()}>
            <button className="px-2 text-red-500 group-hover:bg-red-500 text-sm group-hover:text-white" onClick={handleDeteleFriend}>Hủy kết bạn</button>    
        </div>}
    </div>
}

export default UserCard