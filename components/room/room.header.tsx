"use client"

import { SiGooglemeet } from "react-icons/si"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FC, ReactNode } from "react"
import { useRoomContext } from "@/context/Room.context"
import { useParams, useRouter } from "next/navigation"
import { FaUserFriends } from "react-icons/fa"
import RoomSetting from "./room.setting"
import { CiFileOn, CiImageOn, CiVideoOn } from "react-icons/ci"
import Files from "./room.files"
import { PrivateRoom, PublicRoom } from "./room.header.detail"

type Props = {}

const RoomHeader: FC<Props> = (props) => {
    const router = useRouter()
    const { room } = useParams()
    const { roomDetail } = useRoomContext()

    const RoomHeaderDetail: { [type: number]: ReactNode } = {
        0: <PrivateRoom roomDetail={roomDetail} />,
        3: <PublicRoom roomDetail={roomDetail} />
    }

    return <div className="room_header min-h-[6vh] w-full bg-white border-l-2 border-b-2 flex justify-between items-center py-2 px-4">

        { roomDetail && RoomHeaderDetail[roomDetail.roomType] }

        <div className="flex items-center space-x-3">

            <div className="relative cursor-pointer" onClick={() => router.push(`/${room}/meeting`)}>
                <SiGooglemeet className="text-xl text-sky-500" />
                <p className="absolute -top-2 -left-6 bg-red-500 px-1 rounded-md text-xs font-semibold">beta</p>
            </div>

            <Dialog>
                <DialogTrigger>
                    <FaUserFriends className="text-2xl text-sky-500" />
                </DialogTrigger>
                <DialogContent className="p-0 border-none gap-0 rounded-t-md">
                    <DialogHeader className="border-none m-0 p-4 bg-sky-500 rounded-t-md">
                        <DialogTitle className="mb-4 text-gray-200 font-semibold">Thông tin nhóm</DialogTitle>
                        <div className="flex items-center space-x-4">
                            <img src={roomDetail?.roomIcon || "/images/bg.png"} className="border-2 w-20 h-20 rounded-full" alt="" />
                            <div>
                                <p className="text-lg text-white font-bold">{roomDetail?.roomName}</p>
                                <p className="text-sm text-gray-200">{roomDetail?.roomUsers.length} thành viên</p>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="bg-gray-200 py-2">
                        <div className="bg-white py-2">
                            <Dialog>
                                <DialogTrigger className="w-full">
                                    <div className="hover:bg-gray-200 flex space-x-6 items-center py-3 px-10 w-full">
                                        <CiImageOn className="text-xl" />
                                        <p className="text-sm text-gray-600">Tệp hình ảnh</p>
                                    </div>
                                </DialogTrigger>
                                <DialogContent className="p-0 border-none gap-0 rounded-t-md">
                                    <DialogHeader className="border-none m-0 p-4 bg-sky-500 rounded-t-md">
                                        <DialogTitle className="mb-4 text-gray-200 font-semibold">Hình ảnh</DialogTitle>
                                    </DialogHeader>
                                    <Files type="image" />
                                </DialogContent>
                            </Dialog>

                            <Dialog>
                                <DialogTrigger className="w-full">
                                    <div className="hover:bg-gray-200 flex space-x-6 items-center py-3 px-10">
                                        <CiVideoOn className="text-xl" />
                                        <p className="text-sm text-gray-600">Tệp Video</p>
                                    </div>
                                </DialogTrigger>
                                <DialogContent className="p-0 border-none gap-0 rounded-t-md">
                                    <DialogHeader className="border-none m-0 p-4 bg-sky-500 rounded-t-md">
                                        <DialogTitle className="mb-4 text-gray-200 font-semibold">Videos</DialogTitle>
                                    </DialogHeader>
                                    <Files type="video" />
                                </DialogContent>
                            </Dialog>

                            <Dialog>
                                <DialogTrigger className="w-full">
                                    <div className="hover:bg-gray-200 flex space-x-6 items-center py-3 px-10">
                                        <CiFileOn className="text-xl" />
                                        <p className="text-sm text-gray-600">Tệp tài liệu</p>
                                    </div>
                                </DialogTrigger>
                                <DialogContent className="p-0 border-none gap-0 rounded-t-md">
                                    <DialogHeader className="border-none m-0 p-4 bg-sky-500 rounded-t-md">
                                        <DialogTitle className="mb-4 text-gray-200 font-semibold">Tài liệu</DialogTitle>
                                    </DialogHeader>
                                    <Files type="document" />
                                </DialogContent>
                            </Dialog>

                        </div>
                    </div>

                    <div className="bg-gray-200 pb-2 rounded-b-xl">
                        <div className="bg-white p-2 max-h-[400px] overflow-y-auto scrollbar-none">

                            <p className="ml-2 text-gray-600 font-semibold">Thành viên</p>

                            {roomDetail?.roomUsers.map(item => <div key={item._id} className="group hover:bg-sky-500 p-2 user_room flex items-center justify-between space-x-2">
                                <div className="flex items-center space-x-2">
                                    <img src={item.user.avatar || "/images/default-avatar.jpg"} className="w-12 h-12 border-2 rounded-full bg-red-500" />
                                    <div>
                                        <p className="group-hover:text-white text-gray-700 text-sm">{item.user.fullName}</p>
                                        <p className="group-hover:text-white text-xs text-gray-600 font-semibold">thành viên</p>
                                    </div>
                                </div>
                                <div className="group-hover:flex hidden space-x-2 items-center">

                                </div>
                            </div>)}
                        </div>
                    </div>

                </DialogContent>
            </Dialog>

        </div>
    </div>
}

export default RoomHeader