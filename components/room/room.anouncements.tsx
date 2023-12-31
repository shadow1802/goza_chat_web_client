"use client"
import { HiMiniSpeakerWave } from "react-icons/hi2"
import { BiSolidNotification } from "react-icons/bi";
import { useRoomContext } from "@/context/Room.context"
import { Dispatch, FC, SetStateAction, useState } from "react"
import { TbNotification } from "react-icons/tb"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { MdDeleteOutline, MdOutlineAttachFile } from "react-icons/md"
import { dateTimeConverter } from "@/utils/dateTimeConverter"
import useInvoker from "@/utils/useInvoker"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import { truncate } from "@/utils/helper"
import useAuthValue from "@/utils/useAuthValue"
import AnouncementSender from "../anouncement.sender";
import { nanoid } from "nanoid";
import UploadService from "@/utils/s3.service";
import { useSocket } from "@/context/Socket.context";

type Props = {
    showAnouncementSender: boolean,
    setShowAnouncementSender: Dispatch<SetStateAction<boolean>>
}

const RoomAnouncements: FC<Props> = ({ showAnouncementSender, setShowAnouncementSender }) => {

    const { anouncements, reloader, roomDetail } = useRoomContext()
    const authValue = useAuthValue()
    const [fileDinhKem, setFileDinhKem] = useState<File | null>()
    const invoker = useInvoker()
    const { socket } = useSocket()
    const { toast } = useToast()

    const memberInfo = roomDetail?.roomUsers.find(item => item.user._id === authValue?.user._id)

    const handleDeteleAnouncement = async (id: string) => {
        try {
            const { data, status, message } = await invoker.remove(`/room/notify/deleteRoomNotify/${id}`)
            if (status === 200) {
                await reloader.anouncements()
            } else {
                toast({ title: "Không thể xóa thông báo", duration: 2000, description: <p className="text-red-500">{message}</p> })
            }
        } catch (error) {
            console.log(error)
        }
    }

    const onSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {

        event.preventDefault()

        const form = event.currentTarget
        const { anouncement_content } = form.elements as typeof form.elements & {
            anouncement_content: { value: string },
        }

        let link = ""
        if (fileDinhKem) {
            const params = {
                Body: fileDinhKem,
                Bucket: "luongsonchatapp",
                Key: `announcements/${authValue?.user._id}/${new Date().getTime()}_${nanoid()}`,
                ACL: "public-read"
            };

            await UploadService.uploader(params as any)

            link = `https://luongsonchatapp.sgp1.digitaloceanspaces.com/${params.Key}`
        }

        const { data, status, message } = await invoker.post("/room/notify/create", {
            roomId: roomDetail?._id,
            message: anouncement_content.value,
            ...(link && { file: link })
        })

        if (status === 200 && roomDetail) {
            socket.emit("send_anouncement", {
                anouncementObject: data, roomIds: [roomDetail._id]
            })
            setShowAnouncementSender(false)
        } else {
            toast({ title: "Không thể gửi thông báo", duration: 2000, description: <p className="text-sm text-red-500">{message}</p> })
        }
    }


    return <div>
        {anouncements?.length > 0 ? <div className="bg-white flex border-l-[10px] border-sky-500 shadow-lg drop-shadow-lg items-center w-full h-[4vh] px-4 justify-between">
            <div className="flex space-x-1 text-gray-600 text-sm">
                <strong className="text-sky-500 underline">Thông báo:</strong>
                <span> {truncate(anouncements[0].message, 100)}</span>
                {anouncements[0].file && <div className="flex items-center">
                    <a href={anouncements[0].file} className="text-sky-500" target="_blank">1 tệp đính kèm</a>
                    <MdOutlineAttachFile className="text-sm text-sky-500" />
                </div>}
            </div>

            <div className="flex items-center space-x-2">
                <Dialog open={showAnouncementSender} onOpenChange={setShowAnouncementSender}>
                    <DialogTrigger>
                        <button className="border-[1px] bg-transparent border-sky-500 px-2 rounded-md flex space-x-1 items-center text-sky-500">
                            <HiMiniSpeakerWave className="" />
                            <span className="font-semibold text-sm">Phát thông báo</span>
                        </button>
                    </DialogTrigger>
                    <DialogContent className="p-0 border-0 w-[500px]">
                        <AnouncementSender setShowAnouncementSender={setShowAnouncementSender} setFileDinhKem={setFileDinhKem} onSubmit={onSubmit} fileDinhKem={fileDinhKem}/>
                    </DialogContent>
                </Dialog>
                <Dialog>
                    <DialogTrigger asChild>
                        <button className="border-[1px] bg-transparent border-sky-500 px-2 rounded-md flex space-x-1 items-center text-sky-500">
                            <BiSolidNotification className="" />
                            <span className="font-semibold text-sm">Xem thông báo</span>
                        </button>
                    </DialogTrigger>
                    <DialogContent className="w-[700px] p-0 rounded-none space-y-0">
                        <DialogHeader className="bg-sky-500 rounded-t-lg p-4 m-0">
                            <DialogTitle className="text-white">Thông báo</DialogTitle>
                        </DialogHeader>

                        <div className="h-[400px] px-5 space-y-2 overflow-y-auto scrollbar-none">
                            {anouncements.map(item => {
                                return <div key={item._id} className="group space-x-2">
                                    <div className="flex space-x-2 items-center">
                                        {item.createdBy.avatar ?
                                            <img src={item.createdBy.avatar} alt="" className="w-8 h-8 rounded-full" />
                                            : <img src="/images/default-avatar.jpg" alt="" className="border-2 w-8 h-8 rounded-full" />
                                        }

                                        <p className="text-red-500 text-sm font-semibold">{item.createdBy.fullName} <small className="text-gray-600">{dateTimeConverter(String(item.createdAt))}</small></p>
                                        <div className="hidden group-hover:flex duration-300 space-x-2 items-center text-red-500 cursor-pointer">
                                            <AlertDialog>
                                                <AlertDialogTrigger>
                                                    <div className="cursor-pointer flex space-x-1">
                                                        <MdDeleteOutline />
                                                        <small>Xóa</small>
                                                    </div>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <h3 className="font-semibold underline">Xóa thông báo</h3>
                                                    <p className="text-gray-400 text-sm">Sau khi xóa thông báo, bạn sẽ không thể khôi phục lại</p>

                                                    <div className="flex space-x-2">
                                                        <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDeteleAnouncement(item._id)}>Chấp nhận</AlertDialogAction>
                                                    </div>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>
                                    <p className="text-black text-sm pl-7">{item.message}</p>
                                    {item.file && <a href={item.file} className="pl-7 text-sm text-sky-500 flex space-x-2 items-center" target="_blank"> <MdOutlineAttachFile /> Đính kèm 1 file</a>}
                                </div>
                            })}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div> : <div className="bg-white flex border-l-[10px] border-sky-500 shadow-lg drop-shadow-lg items-center w-full h-[4vh] px-4 justify-between">
            <p className="text-gray-600 text-sm"><strong className="underline text-sky-500">Thông báo:</strong> <span className="text-gray-400">trống</span></p>
            <Dialog open={showAnouncementSender} onOpenChange={setShowAnouncementSender}>
                <DialogTrigger>
                    <button className="border-[1px] bg-transparent border-sky-500 px-2 rounded-md flex space-x-1 items-center text-sky-500">
                        <HiMiniSpeakerWave className="" />
                        <span className="font-semibold text-sm">Phát thông báo</span>
                    </button>
                </DialogTrigger>
                <DialogContent className="p-0 border-0 w-[500px]">
                    <AnouncementSender setShowAnouncementSender={setShowAnouncementSender} setFileDinhKem={setFileDinhKem} onSubmit={onSubmit} fileDinhKem={fileDinhKem}/>
                </DialogContent>
            </Dialog>
        </div>}
    </div>
}

export default RoomAnouncements