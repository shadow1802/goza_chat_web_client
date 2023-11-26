import { useRoomContext } from "@/context/Room.context";
import { FC, useRef, useState } from "react";
import { MdModeEdit } from "react-icons/md"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useLobbyContext } from "@/context/Lobby.context";
import useAuthValue from "@/utils/useAuthValue";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { FaCopy, FaRegCopy, FaUserPlus, FaUserTimes } from "react-icons/fa";
import useInvoker from "@/utils/useInvoker";
import UploadService from "@/utils/s3.service";
import { useParams } from "next/navigation";

type Props = {}

const RoomSetting: FC<Props> = () => {

    const { room } = useParams()
    const { roomDetail, setRoomDetail } = useRoomContext()
    const [roomName, setRoomName] = useState<string>(roomDetail?.roomName ?? "")
    const { users } = useLobbyContext()
    const authValue = useAuthValue()
    const [isActive, setIsActive] = useState<boolean>(roomDetail?.isActive ?? false)
    const [showAddMemberBar, setShowAddMemberBar] = useState<boolean>(false)
    const fileRef = useRef<HTMLInputElement>(null)
    const [roomIconPreview, setRoomIconPreview] = useState<string>(roomDetail?.roomIcon ?? "")
    const invoker = useInvoker()

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
        const handler = await invoker.post(`/usersrooms/delete`, {
            userId, roomId: room
        })
        if (roomDetail) {

            const asd = roomDetail.roomUsers.filter(item => item.user._id !== userId)

            const newRoomDetail = { ...roomDetail, roomUsers: asd }
            setRoomDetail(newRoomDetail)
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
                </div>

                {roomDetail?.roomUsers?.map(user => {
                    return <div key={user._id} className="hover:bg-sky-500 py-2 px-4 flex items-center space-x-2 justify-between">
                        <div className="flex space-x-2 items-center">
                            {user.user.avatar ? <img src={user.user.avatar} className="w-10 h-10 rounded-full" />
                                : <img src="/images/default-avatar.jpg" className="w-10 h-10 rounded-full border-2" />
                            }
                            <p className="text-sm font-semibold">{user.user.fullName}</p>
                        </div>
                        {authValue?.user._id === user.user._id ? <></> : <button disabled={!isOwner} onClick={() => kick(user.user._id)}><FaUserTimes className="text-red-500 text-lg" /></button>}
                    </div>
                })}
            </div>
        </div>
    </div>
}

export default RoomSetting