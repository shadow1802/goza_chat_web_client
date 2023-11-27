"use client"
import { FC, ReactNode } from "react"
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { IRoom } from "@/types/room"
import { IoSettingsOutline } from "react-icons/io5";
import { RiUserAddLine } from "react-icons/ri"
import { dateTimeConverter } from "@/utils/dateTimeConverter";

type Props = {
    room: IRoom,
    children: ReactNode
}

const RoomCardMenu: FC<Props> = ({ room, children }) => {

    return <ContextMenu>
        <ContextMenuTrigger>{children}</ContextMenuTrigger>
        <ContextMenuContent className="rounded-xl min-w-[300px] p-0 shadow-lg drop-shadow-lg">
            <div className="relative rounded-t-xl border-b-8 border-gray-100 room_card_menu_header bg-gradient-to-r from-cyan-500 to-blue-500 shadow-md drop-shadow-md w-full h-24">
                <div className="absolute left-4 -bottom-[45%] flex space-x-2 items-end">
                    <div className="shadow-md drop-shadow-md w-20 h-20 rounded-full border-8 border-gray-100">
                        <img src={room.roomIcon} alt="" className="rounded-full w-full h-full" />
                    </div>
                    <div className="tran-y-3">
                        <p className="leading-[8px] text-sm font-bold text-sky-500 ">{room.roomName} <small className="text-xs font-semibold text-gray-600">{room?.roomUsers?.length ?? '0'} thành viên</small></p>
                    </div>
                </div>
            </div>
            <div className="room_card_menu_body bg-white pt-12 border-b-2 border-x-2 rounded-b-xl w-full pb-2">

                { room.lastMessage && (
                    <div className="text-gray-600 border-b-[0.5px] border-gray-500 pb-2 px-4 flex justify-between space-x-2 items-center">
                        <div className="w-full">
                           <span className="text-xs font-normal">{dateTimeConverter(room.lastMessage.lastModified)}</span>
                            <p className="text-sm font-semibold">{room?.lastMessage?.createdBy?.fullName}: <span className="font-normal">{room.lastMessage.message}</span>...</p>
                        </div>
                        { room.lastMessage?.createdBy?.avatar ? <img src={room.lastMessage.createdBy.avatar} className="w-9 h-9 rounded-full"/>:<img src="/images/default-avatar.jpg" className="border-2 w-9 h-9 rounded-full"/>}
                    </div>
                ) }

                <button className="group flex items-center justify-between text-gray-600 from-cyan-500 to-blue-500 hover:bg-gradient-to-r duration-200 w-full px-4 py-2">
                    <span className="group-hover:text-white text-sm font-semibold">Thiết lập</span>
                    <IoSettingsOutline className="group-hover:text-white"/>
                </button>
                <button className="group flex items-center justify-between text-gray-600 from-cyan-500 to-blue-500 hover:bg-gradient-to-r duration-200 w-full px-4 py-2">
                    <span className="group-hover:text-white text-sm font-semibold">Mời người dùng</span>
                    <RiUserAddLine className="group-hover:text-white"/>
                </button>
                <button className="group flex items-center justify-between text-red-500 from-cyan-500 to-blue-500 hover:bg-gradient-to-r duration-200 w-full px-4 py-2">
                    <span className="text-sm font-semibold">Rời khỏi phòng</span>
                    <RiUserAddLine className=""/>
                </button>
            </div>
        </ContextMenuContent>
    </ContextMenu>
}

export default RoomCardMenu