import { FC, ReactNode, useState, useEffect } from "react"
import Menu from "../menu"
import { IRoom } from "@/types/room"
import { useRouter } from "next/navigation"
import RoomCardMenu from "./room.card.menu"
import { useLobbyContext } from "@/context/Lobby.context"
import { truncate } from "@/utils/helper"
import useInvoker from "@/utils/useInvoker"

type Props = {
    room: IRoom
}

const RoomCard: FC<Props> = ({ room }) => {

    const [detail, setDetail] = useState<IRoom>(room)
    const invoker = useInvoker()
    useEffect(() => { setDetail(room) }, [room])

    const router = useRouter()
    const onClick = async () => {
        setDetail(prev => {
            const next = { ...prev, unseenBy: 0 }
            return next
        })

        router.push(`/${detail._id}`)
        await invoker.put(`/room/setSeenMessage/${detail._id}`)
    }

    return <RoomCardMenu room={detail}>
        <div onClick={onClick} className="cursor-pointer hover:bg-sky-500 rounded-sm hover:shadow-md group relative items-center py-2 px-3 flex space-x-3">
            <img src={detail.roomIcon || "/images/bg.png"} className="bg-sky-500 w-12 h-12 border-2 border-sky-500 rounded-full" alt="" />
            <div>
                <p className="group-hover:text-white text-sm text-gray-500 font-semibold">{truncate(detail.roomName, 21)}</p>
                { detail?.unseenBy > 0 && <p className="absolute right-2 text-xs bg-red-500 text-white rounded-lg px-2">{detail.unseenBy}</p>}
                {detail.lastMessage && (
                    <div className="text-gray-600 flex justify-between space-x-1 items-center">
                        <div className="w-full flex justify-between">
                            <p className="group-hover:text-white text-xs font-semibold"><span className="group-hover:text-white text-sky-500">● {detail.lastMessage?.createdBy?.fullName}</span>: <span className="font-normal">{truncate(detail.lastMessage.message, 12)}</span></p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </RoomCardMenu>
}

export default RoomCard