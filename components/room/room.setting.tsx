import { useRoomContext } from "@/context/Room.context";
import { FC, useRef, useState } from "react";
import { MdModeEdit } from "react-icons/md"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useLobbyContext } from "@/context/Lobby.context";
import useAuthValue from "@/utils/useAuthValue";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { FaCopy, FaRegCopy, FaUserPlus, FaUserTimes } from "react-icons/fa";
import useInvoker from "@/utils/useInvoker";
import UploadService from "@/utils/s3.service";
import { useParams } from "next/navigation";
import { ROOM_ROLES, ROOM_ROLES_COLORS } from "@/constants/room.roles";
import UserRender from "../user.render";
import { useSocket } from "@/context/Socket.context";

type Props = {}

const RoomSetting: FC<Props> = () => {

    const { room } = useParams()
    const { currentUser } = useLobbyContext()
    const { roomDetail, setRoomDetail } = useRoomContext()
    const { socket } = useSocket()
    const [roomName, setRoomName] = useState<string>(roomDetail?.roomName ?? "")
    const { users } = useLobbyContext()
    const authValue = useAuthValue()
    const [isActive, setIsActive] = useState<boolean>(roomDetail?.isActive ?? false)
    const fileRef = useRef<HTMLInputElement>(null)
    const [roomIconPreview, setRoomIconPreview] = useState<string>(roomDetail?.roomIcon ?? "")
    const invoker = useInvoker()

    const inviteMember = async ({ roomId, userId }: { roomId: string, userId: string }) => {
        const { status, data } = await invoker.post("/usersrooms/insert", {
            userId,
            roomId
        })

        if (status === 200) {
            const newData = await invoker.get(`/room/getRoomById/${roomId}`)
            setRoomDetail(newData.data)
            socket.emit("invite_into_room", {
                roomObject: data, roomId: room, userIds: [userId], from: {
                    fullName: currentUser?.fullName,
                    avatar: currentUser?.avatar
                }
            })
        }
    }

    const onSelectedFile = async () => {
        if (fileRef?.current?.files) {

            const params = {
                Body: fileRef.current.files[0],
                Bucket: "luongsonchatapp",
                Key: `admins/${authValue?.user._id}/${new Date().getTime()}_${fileRef.current.files[0].name}`,
                ACL: "public-read"
            };

            await UploadService.uploader(params as any)

            const link = `https://luongsonchatapp.sgp1.digitaloceanspaces.com/${params.Key}`

            await invoker.put(`/room/update/${roomDetail?._id}`, { roomIcon: link })

            setRoomIconPreview(link)
        }
    }

    const onChangeRoomStatus = async () => {
        const data = await invoker.put(`/room/update/${roomDetail?._id}`, { isActive: !isActive })
        setIsActive(!isActive)
    }

    const changeRoomName = async () => {
        await invoker.put(`/room/update/${roomDetail?._id}`, { roomName })
        if (roomDetail) {
            const newRoomDetail = { ...roomDetail, roomName }
            setRoomDetail(newRoomDetail)
        }
    }

    const copier = async (text: string) => {
        await navigator.clipboard.writeText(text)
    }

    const kick = async (userId: string) => {

        console.log("xoa khoi phong", userId)

        const res = await invoker.post(`/usersrooms/delete`, {
            userId, roomId: room
        })

        if (roomDetail && res.status === 200) {
            setRoomDetail(prev => {
                if (prev) {
                    const asd = prev.roomUsers.filter(item => item.user._id !== userId)

                    console.log(asd)

                    return { ...prev, roomUsers: asd }
                } else return null
            })
        }
    }


    const isOwner = roomDetail?.roomOwner === authValue?.user._id

    return <div className={`room_setting py-4`}>
        <div className="w-full flex flex-col items-center">
            <label htmlFor="room_icon">
                {
                    roomIconPreview ? <img src={roomIconPreview} alt="" className="border-4 border-sky-500 rounded-full w-32 h-32" />
                        : <div className="border-4 border-sky-500 rounded-full w-32 h-32 flex flex-col items-center justify-center">
                            <img src="/icons/camera-solid.svg" className="w-8" alt="" />
                            <p className="text-sm font-semibold text-gray-600">Tải ảnh lên</p>
                        </div>
                }
            </label>
            <input disabled={!isOwner} type="file" ref={fileRef} onChange={onSelectedFile} className="hidden" id="room_icon" accept="image/*" />
            <div className="group cursor-pointer flex items-center justify-center">
                <input disabled={!isOwner} onChange={(e) => setRoomName(e.target.value)} value={roomName} className="disabled:bg-white border-none outline-none text-center mt-2 text-lg font-bold text-sky-500 uppercase w-auto" />
                <MdModeEdit className="hidden ml-1 text-sky-500 mt-2 text-base group-hover:block" onClick={changeRoomName} />
            </div>
            <p onClick={() => copier(
                `${process.env.NEXT_PUBLIC_URL_HOST ?? "http://localhost:3000"}/invite/${room}`
            )} className="cursor-pointer flex items-center space-x-2 border-b-2 px-1 py-1 text-xs text-gray-700">
                <span className="cursor-pointer text-sky-600">{process.env.NEXT_PUBLIC_URL_HOST ?? "http://localhost:3000"}/invite/{room}</span>
                <FaRegCopy />
            </p>
        </div>


        <div className="px-6 mt-2">
            <div className="p-2 flex justify-between">
                <div className="flex items-center justify-center space-x-2 w-full">
                    <Switch checked={isActive} disabled={!isOwner} onCheckedChange={onChangeRoomStatus} id="airplane-mode" />
                    <Label htmlFor="airplane-mode">Khóa phòng</Label>
                </div>
            </div>
            <div className="mt-2 border-2">

                <div className="border-b-2 flex p-4 justify-between items-center">
                    <p className="text-sm font-semibold">Danh sách thành viên</p>
                    <AlertDialog>
                        <AlertDialogTrigger><FaUserPlus className="text-lg text-sky-600" /></AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Thêm thành viên</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Sau khi thêm thành viên, người dùng có thể gửi tin nhắn, ảnh, video,...
                                    <div className="mt-4 border-2">
                                        {
                                            users.filter(item => !roomDetail?.roomUsers.map(item => item.user._id).includes(item._id)).map(item => <div
                                                key={item._id} className="group hover:bg-sky-500 border-b-2 p-2 user_room flex items-center justify-between space-x-2">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-10 h-10 border-2 rounded-full bg-sky-600"></div>
                                                    <div>
                                                        <p className="group-hover:text-white text-gray-700 text-sm">{item.fullName}</p>
                                                        <p className="group-hover:text-white text-xs text-gray-600 font-semibold">@{item.username}</p>
                                                    </div>
                                                </div>
                                                <div className="group-hover:flex hidden space-x-2 items-center">
                                                    <FaUserPlus onClick={() => inviteMember({ userId: item._id, roomId: String(room) })} className="cursor-pointer text-lg text-white" />
                                                </div>
                                            </div>)
                                        }
                                    </div>
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Đóng</AlertDialogCancel>

                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>

                <div className="max-h-[400px] overflow-y-auto scrollbar-none">
                    {roomDetail?.roomUsers?.map(user => {
                        return <div key={"room_setting_user_" + user._id} className="py-2 px-4 flex items-center space-x-2 justify-between">
                            <div className="flex space-x-2 items-center">
                                {user.user.avatar ? <img src={user.user.avatar} className="w-10 h-10 rounded-full" />
                                    : <img src="/images/default-avatar.jpg" className="w-10 h-10 rounded-full border-2" />
                                }
                                <div>
                                    <p className="text-sm font-semibold">{user.user.fullName} {authValue?.user._id === user.user._id && "(bạn)"}</p>
                                    <p className={`text-xs font-bold lowercase ${ROOM_ROLES_COLORS[user.roomRole]}`}>{ROOM_ROLES[user.roomRole]}</p>
                                </div>
                            </div>
                            {authValue?.user._id === user.user._id ? <></> : <div className="flex space-x-2">
                                <AlertDialog>
                                    <AlertDialogTrigger>
                                        <button disabled={!isOwner} className="py-1 hover:underline px-1 text-orange-500 disabled:text-gray-500 flex space-x-1 items-center">
                                            <span className="text-xs">Nâng cấp quản lý</span>
                                        </button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Bạn muốn nâng cấp thành viên này thành quản lý hay không?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Sau khi trở thành quản lý, người dùng có thể gửi và quản lý thông báo trong phòng của bạn
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => kick(user.user._id)}>Đồng ý</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                                <AlertDialog>
                                    <AlertDialogTrigger>
                                        <button disabled={!isOwner} className="py-1 hover:underline px-1 text-red-500 disabled:text-gray-500 flex space-x-1 items-center">
                                        <span className="text-xs">Xóa khỏi phòng</span>
                                        </button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Bạn muốn xóa thành viên này khỏi phòng hay không?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Sau khi bị xóa, người dùng vẫn có thể tiếp tục vào phòng của bạn
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => kick(user.user._id)}>Đồng ý</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>}
                        </div>
                    })}
                </div>
            </div>
        </div>
    </div>
}

export default RoomSetting