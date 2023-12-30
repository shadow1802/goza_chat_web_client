"use client"

import { useRoomContext } from "@/context/Room.context"
import { FC } from "react"

type Props = {}

const RoomUsers: FC<Props> = (props) => {

    const { roomDetail, onlineRoomUsers } = useRoomContext()

    return <div className="w-[300px] bg-gray-100">
        <div className="px-2 py-3 bg-sky-500 h-[4vh] flex items-center">
            <p className="text-sm text-white font-semibold">Thành viên đang online:</p>
        </div>

        <div className="flex space-y-2 flex-col p-2">
            {onlineRoomUsers.map(userId => {
                const current = roomDetail?.roomUsers.find(item => item.user._id === userId)
                return current?.user ? <div key={userId} className="relative flex space-x-2 items-center">
                    { current?.user.avatar ? <img src={current?.user.avatar} className="w-10 h-10 rounded-full border-[1px] border-green-500"/>:<img src="/images/default-avatar.jpg" className="w-10 h-10 border-[1px] border-green-500 rounded-full"/>}
                    <p className="text-sm font-semibold text-gray-700">{current?.user.fullName}</p>
                    <div className="w-3 h-3 border-[1px] border-green-500 bg-white absolute bottom-0 left-5 rounded-full"></div>
                </div>:null
            })}
        </div>
    </div>
}

export default RoomUsers