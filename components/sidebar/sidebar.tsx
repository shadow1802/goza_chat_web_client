"use client"
import { useLobbyContext } from "@/context/Lobby.context"
import { AiOutlineSetting, AiOutlineExclamationCircle } from "react-icons/ai"
import { FC, useState } from "react"
import { BiExit } from "react-icons/bi"
import ChatScreen from "../chat_screen/chat_screen"
import { useAuthState } from "@/context/Auth.context"
import { BsJournal } from "react-icons/bs"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { FaUser, FaBullseye, FaRss } from "react-icons/fa"
import {
    Popover,
    PopoverTrigger,
} from "@/components/ui/popover"
import UserEditor from "./sidebar.user.editor"
import RoomCreator from "./sidebar.room.creator"
import { useRouter } from "next/navigation"
import useInvoker from "@/utils/useInvoker"
import Title from "../title"
import { IRoomDetail } from "@/types/room.detail"
import SidebarNotify from "./sidebar.notify"
import FriendMaker from "./sidebar.friend.maker"
import Hoverable from "../hoverable/hoverable"
import Contacts from "./sidebar.contacts"
import RoomCard from "../room/room.card"
import UserCard from "../user.card"

type Props = {}

const Sidebar: FC<Props> = (props) => {

    const { rooms, setPrivateRoomDetail, privateRoomDetail, showChatScreen, setShowChatScreen, currentUser, notifies, users } = useLobbyContext()
    const router = useRouter()
    const { authState, logOut } = useAuthState()
    const [showRoomCreator, setShowRoomCreator] = useState<boolean>(false)
    const { get, post } = useInvoker()

    const unreadNotify = notifies.filter(item => item.isRead === false).length

    const handlerClickUser = async (userId: string) => {

        if (authState) {
            const { data } = await get(`/room/findPrivateRoom/${authState.user._id}_${userId}`)
            if (data) {
                setPrivateRoomDetail(data)
                setShowChatScreen(true)
            } else {
                const { data: newRoom } = await post(`/room/insert`, {
                    roomName: ' ',
                    roomType: 0,
                    key: `${authState.user._id}_${userId}`,
                    roomUsers: JSON.stringify([userId])
                })
                setPrivateRoomDetail(newRoom)
                setShowChatScreen(true)
            }
        }
    }

    const [showListOfContact, setShowListOfContact] = useState<boolean>(false)

    return <div className="w-[380px] min-h-screen bg-white flex overflow-auto">

        {showChatScreen && (<ChatScreen roomDetail={privateRoomDetail} />)}

        <div className="">
            <div className="flex flex-col items-center h-[80vh] overflow-y-auto scrollbar-none bg-sky-500">
                <div onClick={() => router.push("/")} className="cursor-pointer w-20 h-20">
                    <img src="/images/bg.png" className="w-full h-full" alt="" />
                </div>
                <div className="space-y-4 flex flex-col items-center justify-center pt-6">
                    <Hoverable content={<p className="text-sky-500">Danh bạ</p>}>
                        <BsJournal onClick={() => setShowListOfContact(true)} className="shadow-lg drop-shadow-lg cursor-pointer text-4xl text-white" />
                        <span className="mt-1 text-white text-sm font-semibold">Danh bạ</span>
                    </Hoverable>
                    <Dialog open={showRoomCreator} onOpenChange={setShowRoomCreator}>
                        <DialogTrigger>
                            <img onClick={() => setShowRoomCreator(true)} src="/icons/add.svg" className="w-11 h-11" alt="" />
                        </DialogTrigger>
                        <DialogContent className="bg-white">
                            <DialogHeader>
                                <DialogTitle className="text-gray-600">Tạo phòng</DialogTitle>
                            </DialogHeader>

                            <RoomCreator setShowRoomCreator={setShowRoomCreator} setPrivateRoomDetail={setPrivateRoomDetail} />

                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Contacts open={showListOfContact} onOpenChange={setShowListOfContact} handlerClickUser={handlerClickUser} />

            <div className="w-full h-[20vh] bg-sky-500 flex flex-col items-center justify-between py-5">

            </div>
        </div>

        <div className="relative flex-col justify-between h-full flex-grow">

            <div className="">

                <div className="px-4 py-2 flex items-center justify-between">
                    <Title />
                    <Popover>
                        <PopoverTrigger><div>
                            <img src="/icons/bell.svg" className="w-5 h-5" alt="" />
                            <p className="bg-red-500 text-xs rounded-lg px-1 text-white">{String(unreadNotify)}</p>
                        </div>
                        </PopoverTrigger>
                        <SidebarNotify notifies={notifies} />
                    </Popover>
                </div>

                <div className="">
                    <form className="hidden border-y-2 space-x-2 items-center bg-[#d8d8d8] p-1">
                        <img src="/icons/search.svg" className="w-5 h-5" alt="" />
                        <input type="text" placeholder="Tìm người dùng" className="text-gray-600 bg-[#d8d8d8] border-none outline-none bg-opacity-20" />
                    </form>
                </div>
            </div>

            <div className="border-b-2 border-gray-200 pb-2">
                <div className="px-2">
                    <button className="w-full rounded-md hover:bg-gray-200 flex items-center space-x-2 p-2">
                        <FaRss className="text-sky-500" />
                        <p className="text-sky-500 text-sm font-semibold">Thông báo</p>
                    </button>
                </div>
                <div className="px-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <button className="w-full rounded-md hover:bg-gray-200 flex items-center space-x-2 p-2">
                                <FaUser className="text-sky-500" />
                                <p className="text-sky-500 text-sm font-semibold">Thêm bạn bè +</p>
                            </button>
                        </DialogTrigger>
                        <FriendMaker />

                    </Dialog>
                </div>
                <div className="px-2">
                    <button className="w-full rounded-md hover:bg-gray-200 flex items-center space-x-2 p-2">
                        <FaBullseye className="text-sky-500" />
                        <p className="text-sky-500 text-sm font-semibold">Live stream</p>
                    </button>
                </div>
            </div>



            <div className="relative p-2 max-h-[75vh] overflow-y-auto overflow-x-hidden scrollbar-none">
                {rooms.filter(item => item.roomType === 3).map(item => {
                    return <RoomCard key={item._id} room={item} />
                })}

                {currentUser?.friends && currentUser?.friends.map(item => {
                    return <UserCard key={item._id} user={item} handlerClickUser={handlerClickUser} />
                })}

                <div className="h-[0.1px] bg-gray-200"></div>

                {users?.map(item => <UserCard key={item._id} user={item} handlerClickUser={handlerClickUser} />)}

            </div>

            <div className="absolute bottom-0 flex space-x-2 w-full bg-white border-t-2 h-14 items-center px-2">
                {currentUser?.avatar ? <img src={currentUser.avatar} className="w-11 h-11 rounded-full" /> : <img src="/images/default-avatar.jpg" className="border-2 w-11 h-11 rounded-full" />}
                <div className="">
                    <p className="leading-5 text-gray-700 font-semibold text-[0.9rem]">{currentUser?.fullName}</p>
                    <p className="leading-5 text-gray-600 font-semibold text-xs">@{currentUser?.username}</p>
                    <div className="absolute right-2 top-5 flex space-x-1 items-center">
                        <Sheet>
                            <SheetTrigger><AiOutlineSetting className="text-xl text-gray-600" /></SheetTrigger>
                            <SheetContent side={"left"} className="p-0 border-none" >

                                <div className="relative h-full">
                                    <SheetHeader className="bg-gradient-to-r from-cyan-500 to-blue-500 p-6">
                                        <div className="">
                                            <img className="w-12 h-12 bg-green-500 rounded-full" src="/images/default-avatar.jpg" />
                                            <p className="mt-3 text-gray-100 uppercase font-semibold text-sm">{currentUser?.fullName}</p>
                                            <p className="text-gray-200 font-semibold text-xs">@{currentUser?.username}</p>
                                        </div>
                                    </SheetHeader>

                                    <div className="mt-4 px-4 space-y-2">
                                        <Sheet>
                                            <SheetTrigger>
                                                <div className="flex items-center space-x-2 ">
                                                    <AiOutlineSetting className="text-xl text-gray-500" />
                                                    <p className="text-gray-500 text-[0.9rem] font-semibold">Thiết lập tài khoản</p>
                                                </div>
                                            </SheetTrigger>
                                            <SheetContent side={"left"} className="p-0 rounded-none">

                                                <UserEditor />

                                            </SheetContent>
                                        </Sheet>
                                        <div className="flex items-center space-x-2 pb-1">
                                            <AiOutlineExclamationCircle className="text-xl text-gray-500" />
                                            <p className="text-gray-500 text-[0.9rem] font-semibold">Thông tin hỗ trợ</p>
                                        </div>

                                        <div onClick={logOut} className="cursor-pointer flex items-center space-x-2">
                                            <BiExit className="text-xl text-red-500" />
                                            <p className="text-red-500 text-[0.9rem] font-semibold">Đăng xuất</p>
                                        </div>
                                    </div>

                                    <div className="absolute bg-gradient-to-r from-cyan-500 to-blue-500 bottom-0 w-full p-2">
                                        <p className="text-sm text-white font-semibold">Goza chat phiên bản 1.2.0</p>
                                    </div>

                                </div>

                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </div>

    </div>
}

export default Sidebar