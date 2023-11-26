"use client"

import { SiGooglemeet } from "react-icons/si"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FC } from "react"
import { useRoomContext } from "@/context/Room.context"
import { useParams, useRouter } from "next/navigation"
import { FaUserFriends } from "react-icons/fa"
import RoomManager from "./room.manager"
import { IoIosSettings } from "react-icons/io"
import RoomSetting from "./room.setting"

type Props = {}

const RoomHeader: FC<Props> = (props) => {
    const router = useRouter()
    const { room } = useParams()
    const { roomDetail } = useRoomContext()

    return <div className="room_header min-h-[6vh] w-full bg-white border-l-2 border-b-2 flex justify-between items-center py-2 px-4">
        <div>
            <p className="text-sm font-semibold text-black uppercase">{roomDetail?.roomName}</p>
            <p className="text-xs font-semibold text-gray-500">{roomDetail?.roomUsers?.length} thành viên</p>
        </div>
        <div className="flex items-center space-x-3">

            <div className="relative cursor-pointer" onClick={() => router.push(`/${room}/meeting`)}>
                <SiGooglemeet className="text-xl text-sky-500" />
                <p className="absolute -top-2 -left-6 bg-red-500 px-1 rounded-md text-xs font-semibold">beta</p>
            </div>

            <Dialog>
                <DialogTrigger>
                    <FaUserFriends className="text-2xl text-sky-500" />
                </DialogTrigger>
                <DialogContent className="p-0 border-none gap-0">
                    <DialogHeader className="border-none m-0 p-4 bg-sky-500 h-10 rounded-t-lg">
                        <DialogTitle className="text-gray-200 uppercase font-semibold">{roomDetail?.roomName}</DialogTitle>
                    </DialogHeader>

                    <RoomManager />

                </DialogContent>
            </Dialog>

            <Dialog>
                <DialogTrigger>
                <IoIosSettings className="text-2xl text-sky-500" />
                </DialogTrigger>
                <DialogContent className="rounded-none p-0 border-none gap-0">
                    <DialogHeader className="border-none rounded-none m-0 p-4 bg-sky-500 h-10 rounded-t-lg">
                        <DialogTitle className="text-gray-200 text-base font-semibold">Thiết lập</DialogTitle>
                    </DialogHeader>

                    <RoomSetting />

                </DialogContent>
            </Dialog>
        </div>
    </div>
}

export default RoomHeader