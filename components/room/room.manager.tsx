"use client"
import { useRoomContext } from "@/context/Room.context"
import type { FC } from "react"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { FaUser, FaFileImage, FaFileAlt } from "react-icons/fa"
import { dateTimeConverter } from "@/utils/dateTimeConverter"
type Props = {}

const RoomManager: FC<Props> = (props) => {

    const { roomDetail, messages } = useRoomContext()

    return <div className="">

        <Tabs defaultValue="members" className="border-none w-full m-0 p-0">
            <TabsList className="grid p-0 w-full grid-cols-3 rounded-none bg-sky-500 border-none gap-2">
                <TabsTrigger value="members" className="space-x-2 bg-sky-500 text-gray-700 rounded-none"><FaUser /> <p>Thành viên</p></TabsTrigger>
                <TabsTrigger value="medias" className="space-x-2 bg-sky-500 text-gray-700 rounded-none"><FaFileImage /><p>Ảnh và video</p></TabsTrigger>
                <TabsTrigger value="files" className="space-x-2 bg-sky-500 text-gray-700 rounded-none"><FaFileAlt /><p>Tệp tin</p></TabsTrigger>
            </TabsList>
            <TabsContent value="members" className="p-0 m-0 min-h-[200px] w-full">
                <form className="flex space-x-2 bg-gray-200 p-2">
                    <img src="/icons/search.svg" alt="" />
                    <input type="text" placeholder="Nhập tên người dùng để tìm kiếm" className="border-none outline-none bg-gray-200 text-gray-200 text-sm w-full" />
                </form>

                <div className="flex flex-col space-y-2 p-2">
                    {roomDetail?.roomUsers.map(item => <div key={item._id} className="group hover:bg-sky-500 rounded-lg p-2 user_room flex items-center justify-between space-x-2">
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 border-2 rounded-full bg-sky-600"></div>
                            <div>
                                <p className="group-hover:text-white text-gray-700 text-sm">{item.user.fullName}</p>
                                <p className="group-hover:text-white text-xs text-gray-600 font-semibold">@username</p>
                            </div>
                        </div>
                        <div className="group-hover:flex hidden space-x-2 items-center">
                            <img className="cursor-pointer" src="/icons/call.svg" alt="" />
                            <img className="cursor-pointer" src="/icons/chat.svg" alt="" />
                            <img className="cursor-pointer" src="/icons/add-friend.svg" alt="" />
                        </div>
                    </div>)}
                </div>
            </TabsContent>
            <TabsContent value="medias" className="p-0 m-0 min-h-[200px] w-full">
                <div className="p-4 space-y-2 max-h-[500px] overflow-y-auto scrollbar-none">
                    {messages.filter(item => item.file).map(item => <div className="group px-2 py-2 flex space-x-3 items-center hover:bg-sky-500 rounded-md">
                        <img src={item.file} className="w-16 h-16 rounded-lg" />
                        <div>
                            <p className="group-hover:text-white text-sky-500 text-sm font-semibold">{item.createdBy.fullName}</p>
                            <small className="group-hover:text-white text-gray-500 text-xs">{dateTimeConverter(String(item.lastModified))}</small>
                        </div>
                    </div>)}
                </div>
            </TabsContent>
            <TabsContent value="files" className="p-0 m-0 min-h-[200px] w-full">
                
            </TabsContent>
        </Tabs>

    </div>
}

export default RoomManager