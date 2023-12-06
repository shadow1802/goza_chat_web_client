import { FC, ReactNode, useState } from "react"
import Menu from "../menu"
import { IRoom } from "@/types/room"
import { useRouter } from "next/navigation"
import RoomCardMenu from "./room.card.menu"
import { useLobbyContext } from "@/context/Lobby.context"

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
            <div onClick={onClick} className="cursor-pointer border-2 rounded-full bg-darkness-700 m-2 w-14 h-14">
                {room.roomIcon ?
                    <img src={room.roomIcon} className="w-full rounded-full h-full" alt="" />
                    : <div className="w-full h-full"></div>
                }
            </div>
        </RoomCardMenu>
}

export default RoomCard