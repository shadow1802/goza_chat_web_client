"use client"
import { useLobbyContext } from "@/context/Lobby.context"
import { useSocket } from "@/context/Socket.context"
import { IRoom } from "@/types/room"
import { IUser } from "@/types/user"
import { truncate } from "@/utils/helper"
import useInvoker from "@/utils/useInvoker"
import { FC, useEffect, useState } from "react"
type Props = {
    user: { username: string, fullName: string, avatar: string, _id: string }
    handlerClickUser?: (id: string) => Promise<void>
    isFriend?: boolean
    [key: string]: any
}

const UserCard: FC<Props> = ({ user, isFriend, handlerClickUser, ...rest }) => {
    const { rooms } = useLobbyContext()
    const { currentUser } = useLobbyContext()
    const { socket } = useSocket()
    const invoker = useInvoker()
    const [chatInfo, setChatInfo] = useState<IRoom | undefined>(undefined)

    useEffect(() => {
        const LOL = rooms.filter(item => item.roomType === 0)
        const info = LOL.find((room: IRoom) => room?.key?.includes(user._id))
        setChatInfo(info)
    }, [rooms])

    const handleDeteleFriend = async () => {
        const { data, status, message } = await invoker.remove(`/friend/deleteFriend/${user._id}`)

        if (status === 200) {
            socket.emit("delete_friend", { fromUserObject: data.from, toUserObject: data.to })
        }
    }

    const onClick = async () => {

        handlerClickUser && await handlerClickUser(user._id)

        setChatInfo(prev => {
            if (prev) {
                const next = { ...prev, unseenBy: [] }
                return next
            }
        })

        await invoker.put(`/room/setSeenMessage/${chatInfo?._id}`)
    }

    const unseenMessages = chatInfo?.unseenBy.filter(item => item === currentUser?._id).length

    return <div {...rest} {...(handlerClickUser && { onClick })} className="group cursor-pointer flex justify-between items-center hover:bg-sky-500 rounded-sm px-3 py-2">

        <div className="flex space-x-3">
            {user.avatar ? <img src={user.avatar} className="rounded-full w-12 h-12" /> : <img src="/images/default-avatar.jpg" className="border-2 rounded-full w-12 h-12" />}

            <div>
                <p className="text-sky-500 group-hover:text-white text-[0.89rem] font-semibold">{user.fullName}</p>
                {chatInfo && <div className="text-xs text-gray-500 group-hover:text-white">
                    {chatInfo.lastMessage && <p><span>● {chatInfo.lastMessage?.createdBy?.fullName}</span>: <span className="font-normal">{truncate(chatInfo.lastMessage.message, 12)}</span></p>}
                </div>}
            </div>
        </div>

        {!!unseenMessages && (unseenMessages > 0 ? <p className="text-xs bg-red-500 text-white rounded-lg px-2">{unseenMessages}</p> : null)}

        {isFriend && <div onClick={e => e.stopPropagation()}>
            <button className="px-2 text-red-500 group-hover:bg-red-500 text-sm group-hover:text-white" onClick={handleDeteleFriend}>Hủy kết bạn</button>
        </div>}
    </div>
}

export default UserCard