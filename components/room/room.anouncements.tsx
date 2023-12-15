"use client"

import { useRoomContext } from "@/context/Room.context"
import { FC } from "react"
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

type Props = {}

const RoomAnouncements: FC<Props> = () => {

    const { anouncements, reloader } = useRoomContext()
    const invoker = useInvoker()
    const { toast } = useToast()

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

    return <div>
        {anouncements?.length > 0 ? <div className="flex items-center border-b-2 border-l-[10px] border-l-sky-500  w-full h-[4vh] px-4 justify-between">
            <div className="flex space-x-1 text-gray-600 text-sm">
                <strong className="text-sky-500 underline">Thông báo:</strong>
                <span> {truncate(anouncements[0].message, 100)}</span>
                {anouncements[0].file && <div className="flex items-center">
                    <a href={anouncements[0].file} className="text-sky-500" target="_blank">1 tệp đính kèm</a>
                    <MdOutlineAttachFile className="text-sm text-sky-500" />
                </div>}
            </div>

            <Dialog>
                <DialogTrigger asChild>
                    <TbNotification className="text-lg text-gray-600 cursor-pointer" />
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
                                                    <AlertDialogAction onClick={()=>handleDeteleAnouncement(item._id)}>Chấp nhận</AlertDialogAction>
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
        </div> : <div className="border-l-sky-500 border-l-[10px] flex items-center border-b-2 w-full h-[4vh] px-4 justify-between">
            <p className="text-gray-600 text-sm"><strong className="underline text-sky-500">Thông báo:</strong> <span className="text-gray-400">trống</span></p>
        </div>}
    </div>
}

export default RoomAnouncements