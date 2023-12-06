import { useRoomContext } from "@/context/Room.context";
import { FC, useRef, useState } from "react";
import { MdModeEdit } from "react-icons/md"
import { useToast } from "@/components/ui/use-toast"
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
import { useParams, useRouter } from "next/navigation";
import { ROOM_ROLES, ROOM_ROLES_COLORS } from "@/constants/room.roles";
import { useSocket } from "@/context/Socket.context";

type Props = {}

const RoomSetting: FC<Props> = () => {

    const { room } = useParams()
    const { currentUser } = useLobbyContext()
    const { roomDetail, setRoomDetail, reloader } = useRoomContext()
    const { socket } = useSocket()
    const router = useRouter()
    const { setRooms } = useLobbyContext()
    const [roomName, setRoomName] = useState<string>(roomDetail?.roomName ?? "")
    const { users } = useLobbyContext()
    const authValue = useAuthValue()
    const [isActive, setIsActive] = useState<boolean>(!roomDetail?.isActive ?? false)
    const fileRef = useRef<HTMLInputElement>(null)
    const [roomIconPreview, setRoomIconPreview] = useState<string>(roomDetail?.roomIcon ?? "")
    const invoker = useInvoker()
    const [inviteUrl, setInviteUrl] = useState<string>("")
    const { toast } = useToast()

    const inviteMember = async ({ roomId, userId }: { roomId: string, userId: string }) => {
        const { status, data } = await invoker.post("/usersrooms/insert", {
            userId,
            roomId
        })

        if (status === 200) {
            await reloader.roomDetail()
            socket.emit("invite_into_room", {
                roomObject: data, roomId: room, userIds: [userId], from: {
                    fullName: currentUser?.fullName,
                    avatar: currentUser?.avatar
                }
            })
        }
    }

    const setUserAsManager = async (userId: string) => {
        const { data, status, message } = await invoker.put("/usersrooms/setUserAsRoomManager", {
            userId,
            roomId: room
        })

        if (status === 200) {
            await reloader.roomDetail()
        }
    }

    const deleteRoom = async () => {
        const { data, status } = await invoker.remove(`/room/delete/${room}`)
        if (status === 200) {
            const { data } = await invoker.get("/room/getByToken")
            setRooms(data.filter((item: any) => item !== null))
            router.push("/")
        }
    }

    const createInviteLink = async () => {
        const { data } = await invoker.post(`/room/createInvite`, { roomId: room })
        console.log(data)
        const url = process.env.NEXT_PUBLIC_URL_HOST + "/invition/" + data._id
        setInviteUrl(url)
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
        setIsActive(!isActive)
        const { data, status, message } = await invoker.put(`/room/update/${roomDetail?._id}`, { isActive: 0 })

        console.log(data, status, message)

        await reloader.roomDetail()
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
        toast({ title: "Copy thành công", description: <p className="text-sm text-sky-500">{text}</p> })
    }

    const kick = async (userId: string) => {


        const res = await invoker.post(`/usersrooms/delete`, {
            userId, roomId: room
        })

        if (roomDetail && res.status === 200) {

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
                <input disabled={!isOwner} onChange={(e) => setRoomName(e.target.value)} value={roomName} className="disabled:bg-white border-none outline-none text-center mt-2 text-lg font-bold text-sky-500 w-auto" />
                <MdModeEdit className="hidden ml-1 text-sky-500 mt-2 text-base group-hover:block" onClick={changeRoomName} />
            </div>

            <button onClick={createInviteLink} className="text-lg px-4 py-1 rounded-md text-white bg-sky-500 my-1">Tạo link mời</button>

            {inviteUrl && <div onClick={()=>copier(inviteUrl)} className="cursor-pointer my-2 rounded-lg bg-gray-200 px-4 py-2 shadow-lg drop-shadow-lg border-t-2 flex space-x-2 items-center">
                <p className="cursor-pointer text-xs text-sky-500">{inviteUrl}</p>
                <FaCopy className="text-sky-500"/>
            </div>}

            {inviteUrl && <p className="text-sm">Link mời sẽ tồn tại trong vòng 3 phút</p>}

        </div>


        <div className="px-6 mt-2">
            {/*<div className="p-2 flex justify-between">
                <div className="flex border-b-2 py-2 items-center justify-center space-x-2 w-full">
                    <Switch checked={isActive} disabled={!isOwner} onCheckedChange={onChangeRoomStatus} id="airplane-mode" className="data-[state=checked]:bg-red-500" />
                    <Label htmlFor="airplane-mode">Khóa phòng</Label>
                </div>
            </div>*/}

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
                                            users?.filter(item => !roomDetail?.roomUsers.map(item => item.user._id).includes(item._id)).map(item => <div
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
                                            <span className="text-xs">{user.roomRole === 1 ? "Giáng cấp" : "Nâng cấp quản lý"}</span>
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
                                            <AlertDialogAction onClick={() => setUserAsManager(user.user._id)}>Đồng ý</AlertDialogAction>
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
        <div className="px-6">

            <AlertDialog>
                <AlertDialogTrigger className="w-full">
                    <button disabled={!isOwner} className="disabled:bg-gray-400 w-full px-2 text-white py-1 rounded-b-md font-semibold bg-red-500">Xóa phòng</button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xóa phòng</AlertDialogTitle>
                        <AlertDialogDescription>
                            <p>Bạn sẽ không thể không phục dữ liệu cho phòng này sau khi xóa phòng</p>
                            <p>Vẫn tiếp tục xóa?</p>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction disabled={!isOwner} onClick={deleteRoom}>Chấp nhận</AlertDialogAction>
                        <AlertDialogCancel>Đóng</AlertDialogCancel>

                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    </div>
}

export default RoomSetting