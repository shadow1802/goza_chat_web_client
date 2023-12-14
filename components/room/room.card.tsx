import { FC, ReactNode, useState } from "react"
import Menu from "../menu"
import { IRoom } from "@/types/room"
import { useRouter } from "next/navigation"
import RoomCardMenu from "./room.card.menu"
import { useLobbyContext } from "@/context/Lobby.context"
import { truncate } from "@/utils/helper"

type Props = {
    room: IRoom
}

const RoomCard: FC<Props> = ({ room }) => {

    const router = useRouter()

    const { setLoading } = useLobbyContext()

    const onClick = () => {
        setLoading(true)
        router.push(`/${room._id}`)
        setTimeout(() => setLoading(false), 1250)
    }


    return <RoomCardMenu room={room}>
        <div onClick={onClick} className="cursor-pointer hover:bg-sky-500 rounded-sm hover:shadow-md group relative items-center py-2 px-3 flex space-x-2">
            <img src={room.roomIcon || "/images/bg.png"} className="bg-sky-500 w-12 h-12 border-2 border-sky-500 rounded-full" alt="" />
            <div>
                <p className="group-hover:text-white text-sm text-gray-500 font-semibold">{truncate(room.roomName, 21)}</p>
                {room.lastMessage && (
                    <div className="text-gray-600 flex justify-between space-x-1 items-center">
                        <div className="w-full flex justify-between">
                            <p className="group-hover:text-white text-xs font-semibold"><span className="group-hover:text-white text-sky-500">● {room.lastMessage?.createdBy?.fullName}</span>: <span className="font-normal">{truncate(room.lastMessage.message, 12)}</span></p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </RoomCardMenu>
}

export default RoomCard