import { FC, ReactNode } from "react"
import Menu from "../menu"
import { IRoom } from "@/types/room"
import { useRouter } from "next/navigation"
import RoomCardMenu from "./room.card.menu"
type Props = {
    room: IRoom
}

const RoomCard: FC<Props> = ({ room }) => {

    const router = useRouter()

    const list: ReactNode[] = [
        <button disabled className="text-white">{room.roomName}</button>,
        <button className="text-red-500">Rời khỏi phòng</button>
    ]

    if (room.lastMessage) list.unshift(<button disabled className="text-white flex space-x-2 items-center">
        {room.lastMessage?.createdBy?.avatar ? <img src={room.lastMessage.createdBy.avatar} className="w-9 h-9 rounded-full"/>:<div className="w-8 h-8 bg-sky-500 rounded-full"></div>}
        <div className="flex flex-col items-start">
            <p className="font-semibold">{room.lastMessage?.createdBy?.fullName}</p>
            <p>{room.lastMessage.message}</p>
        </div>
    </button>)

    return <RoomCardMenu room={room}>
        <div onClick={() => router.push(`/${room._id}`)} className="cursor-pointer border-2 rounded-full bg-darkness-700 m-2 w-14 h-14">
            {room.roomIcon ?
                <img src={room.roomIcon} className="w-full rounded-full h-full" alt="" />
                : <div className="w-full h-full"></div>}
        </div>
    </RoomCardMenu>
}

export default RoomCard