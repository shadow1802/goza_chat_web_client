"use client"
import { FC, useRef, useState, Dispatch, SetStateAction } from "react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { useLobbyContext } from "@/context/Lobby.context"
import User from "./sidebar.room.creator.user"
import useInvoker from "@/utils/useInvoker"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import UploadService from "@/utils/s3.service"
import useAuthValue from "@/utils/useAuthValue"
import SidebarUserSelector from "./sidebar.user.selector"
import { IRoomDetail } from "@/types/room.detail"
import { useSocket } from "@/context/Socket.context"

type Props = {
    setShowRoomCreator: Dispatch<SetStateAction<boolean>>
    setPrivateRoomDetail: Dispatch<SetStateAction<IRoomDetail | null>>
}

const RoomCreator: FC<Props> = ({ setShowRoomCreator, setPrivateRoomDetail }) => {

    const router = useRouter()
    const { socket } = useSocket()
    const { toast } = useToast()
    const { setShowChatScreen, reloader } = useLobbyContext()
    const [usersSelected, setUsersSelected] = useState<{ _id: string, fullName: string }[]>([])
    const roomNameRef = useRef<HTMLInputElement>(null)
    const authValue = useAuthValue()
    const [roomIcon, setRoomIcon] = useState<string | null>(null)
    const [partner, setPartner] = useState<string>("")
    const invoker = useInvoker()

    const fileRef = useRef<HTMLInputElement>(null)

    const uploadHandler = async () => {

        if (fileRef.current?.files) {
            const params = {
                Body: fileRef.current.files[0],
                Bucket: "luongsonchatapp",
                Key: `admins/${authValue?.user._id}/${new Date().getTime()}_${fileRef.current.files[0].name}`,
                ACL: "public-read"
            };

            await UploadService.uploader(params as any)

            const link = `https://luongsonchatapp.sgp1.digitaloceanspaces.com/${params.Key}`
            setRoomIcon(link)
        }
    }

    const createRoomHandler = async () => {
        if (roomNameRef?.current?.value) {

            let roomName = roomNameRef.current.value.trim()

            if (roomName.length === 0) {
                toast({ title: "Tên phòng không hợp lệ" })
                return
            }

            const { data, status, message } = await invoker.post("/room/insert", {
                roomName,
                roomType: 3,
                ...(!!roomIcon && { roomIcon }),
                ...(usersSelected.length > 0 && { roomUsers: JSON.stringify(usersSelected.map(i => i._id)) })
            })

            socket.emit("invite_into_room", {
                roomObject: data, roomId: data._id, userIds: usersSelected.map(i => i._id)
            })

            setShowRoomCreator(false)

            router.push(`/${data._id}`)

            await reloader.rooms()
        }
    }

    const createPrivateRoom = async () => {
        if (partner) {
            const { data } = await invoker.get(`/room/findPrivateRoom/${authValue?.user._id}_${partner}`)
            if (data) {
                setPrivateRoomDetail(data)
                setShowRoomCreator(false)
                setShowChatScreen(true)
            } else {
                const { data: newRoom } = await invoker.post(`/room/insert`, {
                    roomName: ' ',
                    roomType: 0,
                    key: `${authValue?.user._id}_${partner}`,
                    roomUsers: JSON.stringify([partner])
                })
                setPrivateRoomDetail(newRoom)
                setShowRoomCreator(false)
                setShowChatScreen(true)
            }
        }
    }

    const { users } = useLobbyContext()

    return <div className="relative">
        <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="account" className="">Trò chuyện nhóm</TabsTrigger>
                <TabsTrigger value="password" className="">Trò chuyện riêng tư</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
                <Card className=" border-darkness-500">
                    <CardHeader className="flex justify-center items-center">

                        <label htmlFor="media-uploader" className="cursor-pointer w-28 h-28 flex flex-col items-center justify-center rounded-full border-dashed border-2">
                            {roomIcon ? <img src={roomIcon} className="w-28 h-28 rounded-full" /> : (<>
                                <img src="/icons/camera-solid.svg" className="w-8" alt="" />
                                <p className="text-sm font-semibold text-gray-600">Tải ảnh lên</p></>)}
                        </label>
                        <input id="media-uploader" ref={fileRef} onChange={uploadHandler} className="hidden" type="file" accept="image/*" multiple />

                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="space-y-1">
                            <Label htmlFor="name" className="text-gray-600">Tên phòng</Label>
                            <Input ref={roomNameRef} id="name" />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="username" className="text-white">Thành viên</Label>
                        </div>
                        <div>
                            <button className="text-gray-600 bg-transparent w-full text-sm font-semibold rounded-t-lg py-[0.70rem] border-2">{
                                usersSelected.length > 0 ? (
                                    usersSelected.length === 1 ? usersSelected[0].fullName
                                        : `${usersSelected[0].fullName} và ${usersSelected.length - 1} người khác`
                                ) : `Vui lòng thêm người dùng`
                            }</button>
                            <div className="w-full h-[200px] scrollbar-none border-r-2 border-l-2 border-b-2 rounded-b-lg overflow-y-auto">
                                {
                                    users?.map(user => <User key={user._id} data={user} usersSelected={usersSelected} setUsersSelected={setUsersSelected} />)
                                }
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full bg-sky-500 hover:bg-sky-400" onClick={createRoomHandler}>Hoàn tất</Button>
                    </CardFooter>
                </Card>
            </TabsContent>
            <TabsContent value="password">
                <Card>
                    <CardHeader>
                        <CardTitle>Trò chuyện riêng tư</CardTitle>
                        <CardDescription>
                            Vui lòng chọn 1 người bạn để bắt đầu cuộc trò chuyện
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="space-y-1">
                            <Label htmlFor="current"></Label>
                            <SidebarUserSelector setPartner={setPartner} />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={createPrivateRoom} className="w-full bg-sky-500 hover:bg-sky-400">Bắt đầu cuộc trò chuyện</Button>
                    </CardFooter>
                </Card>
            </TabsContent>
        </Tabs>


    </div>
}

export default RoomCreator