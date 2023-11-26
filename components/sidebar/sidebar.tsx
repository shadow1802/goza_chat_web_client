"use client"
import { useLobbyContext } from "@/context/Lobby.context"
import { AiOutlineSetting, AiOutlineExclamationCircle } from "react-icons/ai"
import { FC, useEffect, useState } from "react"
import { BiExit } from "react-icons/bi"
import RoomCard from "../room.card"
import UserCard from "../user.card"
import ChatScreen from "../chat_screen/chat_screen"
import { useAuthState } from "@/context/Auth.context"
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
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import UserEditor from "./sidebar.user.editor"
import RoomCreator from "./sidebar.room.creator"
import { useRouter } from "next/navigation"
import { INotifyContentMessage } from "@/types/notify"
import NOTIFY from "@/constants/notify.types"
import useInvoker from "@/utils/useInvoker"
import { IUser } from "@/types/user"
import { IRoom } from "@/types/room"
import Title from "../title"
import { dateTimeConverter } from "@/utils/dateTimeConverter"
import useQuickBlox from "@/utils/useQuickBlox"
import useAuthValue from "@/utils/useAuthValue"
import { IRoomDetail } from "@/types/room.detail"

type Props = {}

const Sidebar: FC<Props> = (props) => {

    const { rooms, users, showChatScreen, setShowChatScreen, currentUser, notifies } = useLobbyContext()
    const router = useRouter()
    const { authState, logOut } = useAuthState()
    const authValue = useAuthValue()
    const [showRoomCreator, setShowRoomCreator] = useState<boolean>(false)
    const [privateRoomDetail, setPrivateRoomDetail] = useState<IRoomDetail | null>(null)

    // const { QB, makeCall } = useQuickBlox()

    const { get, post } = useInvoker()


    const handlerClickUser = async (user: IUser) => {
        if (authState) {
            const { data } = await get(`/room/findPrivateRoom/${authState.user._id}_${user._id}`)
            if (data) {
                setPrivateRoomDetail(data)
                setShowChatScreen(true)
            } else {
                const { data: newRoom } = await post(`/room/insert`, {
                    roomName: ' ',
                    roomType: 0,
                    key: `${authState.user._id}_${user._id}`,
                    roomUsers: JSON.stringify([user._id])
                })
                setPrivateRoomDetail(newRoom)
                setShowChatScreen(true)
            }
        }
    }

    useEffect(() => {
        
    }, [])

    return <div className="w-[360px] min-h-screen bg-white flex overflow-auto">

        <audio id="localMedia" />
        <audio id="remoteMedia" />

        {showChatScreen && (<ChatScreen roomDetail={privateRoomDetail} />)}

        <div className="">
            <div className="flex flex-col items-center h-[80vh] overflow-y-auto scrollbar-none bg-sky-500">
                <div onClick={() => router.push("/")} className="cursor-pointer w-20 h-20">
                    <img src="/images/bg.png" className="w-full h-full" alt="" />
                </div>
                {rooms?.filter(item => item.roomType === 3).map(item => <RoomCard key={item._id} room={item} />)}
            </div>
            <div className="w-full h-[20vh] bg-sky-500 flex flex-col items-center justify-between py-5">
                <Dialog open={showRoomCreator} onOpenChange={setShowRoomCreator}>
                    <DialogTrigger>
                        <img onClick={() => setShowRoomCreator(true)} src="/icons/add.svg" className="w-9 h-9" alt="" />
                    </DialogTrigger>
                    <DialogContent className="bg-white">
                        <DialogHeader>
                            <DialogTitle className="text-gray-600">Tạo phòng</DialogTitle>
                        </DialogHeader>

                        <RoomCreator setShowRoomCreator={setShowRoomCreator} setPrivateRoomDetail={setPrivateRoomDetail}/>

                    </DialogContent>
                </Dialog>

                <img src="/icons/call.svg" className="cursor-pointer w-9 h-9" alt="" />
                <img src="/icons/saved.svg" className="w-9 h-9" alt="" />
            </div>
        </div>

        <div className="relative flex-col justify-between space-y-2 h-full flex-grow">

            <div className="">

                <div className="px-4 py-2 flex items-center justify-between">
                    <Title />
                    <Popover>
                        <PopoverTrigger><img src="/icons/bell.svg" className="w-5 h-5" alt="" /></PopoverTrigger>
                        <PopoverContent className="w-[320px] p-3">
                            <div className="space-y-2 h-[300px] overflow-y-auto scrollbar-none border-b-2 border-gray-200">
                                {notifies?.map(noti => {
                                    const content = JSON.parse(noti.content) as INotifyContentMessage
                                    return <div key={noti._id} className="hover:bg-sky-500 px-2 py-1 rounded-md duration-200 cursor-pointer flex items-center space-x-2">
                                        {content.createdBy.avatar ? <img src={content.createdBy.avatar} className="w-8 h-8 rounded-full" /> : <div className="w-7 h-7 rounded-full bg-red-500"></div>}
                                        <div>
                                            <p className="text-sm">{content.createdBy.fullName} <span className="text-xs">{dateTimeConverter(noti.createdAt)}</span></p>
                                            <p className="text-sm font-semibold">{NOTIFY[noti.type]}</p>
                                        </div>
                                    </div>
                                })}
                            </div>
                            {notifies.length > 0 && <p className="hover:text-sky-500 cursor-pointer text-sm">Đánh dấu là đã đọc</p>}
                        </PopoverContent>
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
                    <button className="w-full rounded-md hover:bg-gray-200 flex items-center space-x-2 p-2">
                        <FaUser className="text-sky-500" />
                        <p className="text-sky-500 text-sm font-semibold">Bạn bè</p>
                    </button>
                </div>
                <div className="px-2">
                    <button className="w-full rounded-md hover:bg-gray-200 flex items-center space-x-2 p-2">
                        <FaBullseye className="text-sky-500" />
                        <p className="text-sky-500 text-sm font-semibold">Live stream</p>
                    </button>
                </div>
            </div>

            <div className="px-4 flex justify-between">
                <p className="font-semibold text-gray-600">Danh bạ:</p>

                <div className="flex items-center space-x-1">
                    <img src="/icons/add-user.svg" className="w-5 h-5" alt="" />
                    <img src="/icons/search.svg" className="w-5 h-5" alt="" />
                </div>
            </div>

            <div className="px-3 space-y-2 relative">
                {users?.map(item => <UserCard key={item._id} user={item} onClick={() => handlerClickUser(item)} />)}
            </div>

            <div className="absolute bottom-0 flex space-x-2 w-full bg-white border-t-2 h-14 items-center px-2">
                { currentUser?.avatar ? <img src={currentUser.avatar} className="w-11 h-11 rounded-full"/> : <img src="/images/default-avatar.jpg" className="border-2 w-11 h-11 rounded-full"/>}
                <div className="">
                    <p className="leading-5 text-gray-700 font-semibold text-[0.9rem]">{currentUser?.fullName}</p>
                    <p className="leading-5 text-gray-600 font-semibold text-xs">@{currentUser?.username}</p>
                    <div className="absolute right-2 top-5 flex space-x-1 items-center">
                        <Sheet>
                            <SheetTrigger><AiOutlineSetting className="text-xl text-gray-600" /></SheetTrigger>
                            <SheetContent side={"left"} className="p-0 border-none">

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

                                                <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center space-x-2 drop-shadow shadow shadow-black">
                                                    <img src="/images/default-avatar.jpg" className="w-14 h-14 bg-sky-500 rounded-full border-4 border-darkness-500" />
                                                    <div>
                                                        <p className="text-gray-100 uppercase font-semibold text-sm">{currentUser?.fullName}</p>
                                                        <p className="text-gray-200 font-semibold text-xs">@{currentUser?.username}</p>
                                                    </div>
                                                </div>

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