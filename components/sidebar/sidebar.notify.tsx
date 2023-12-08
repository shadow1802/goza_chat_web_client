"use client"
import { INotify, NotifyContent } from "@/types/notify"
import { FC, ReactNode } from "react"
import {
    PopoverContent
} from "@/components/ui/popover"
import NOTIFY from "@/constants/notify.types"
import { dateTimeConverter } from "@/utils/dateTimeConverter"
import { useRouter } from "next/navigation"
import useInvoker from "@/utils/useInvoker"
type Props = { notifies: INotify[] }

const SidebarNotify: FC<Props> = ({ notifies }) => {

    const router = useRouter()
    const invoker = useInvoker()

    const onClickToNotifyAction = (noti: INotify) => {
        const actions: { [key: string]: () => void } = {
            "receive_friend": async () => {
                console.log(noti.content)
                await invoker.put(`/notify/setNotifyIsReadStatus/${noti._id}`)
            },
            "receive_message": async () => {
                const content = JSON.parse(noti.content) as NotifyContent
                await invoker.put(`/notify/setNotifyIsReadStatus/${noti._id}`)
                router.push(`/${content.room._id}`)
            }
        }
        return actions[noti.type]()
    }

    return <PopoverContent className="w-[320px] border-x-2 border-sky-500 p-0 rounded-t-lg">
        <div className="rounded-t-lg px-4 py-2 w-full bg-sky-500 border-b-2 border-sky-500 shadow-lg drop-shadow-lg">
            <p className="text-white font-semibold">Thông báo</p>
        </div>
        <div className="h-[300px] overflow-y-auto scrollbar-none">
            {notifies?.map(noti => {
                const content = JSON.parse(noti.content) as NotifyContent
                return <div key={noti._id} onClick={() => onClickToNotifyAction(noti)} className={`group ${!noti.isRead && "bg-gray-200"} hover:bg-sky-500 px-2 py-1 duration-200 cursor-pointer flex items-center space-x-2`}>
                    {content.createdBy.avatar ? <img src={content.createdBy.avatar} className="border-2 border-sky-500 group-hover:border-white w-9 h-9 rounded-full" /> : <img src="images/default-avatar.jpg" className="border-2 border-sky-500 group-hover:border-white w-9 h-9 rounded-full" />}
                    <div>
                        <p className="group-hover:text-white duration-200 text-sm">{content.createdBy.fullName} <span className="text-xs">{dateTimeConverter(noti.createdAt)}</span></p>
                        <p className="group-hover:text-white duration-200 text-sm font-semibold">{content.room.roomName && <span className="px-1 text-xs bg-sky-500 text-white">{content.room.roomName}</span>} {NOTIFY[noti.type]}</p>
                    </div>
                </div>
            })}
        </div>
        <div className="border-t-2 border-sky-500 bg-sky-500 px-4 py-1">
            {notifies.length > 0 && <p className="text-gray-200 font-semibold hover:text-white cursor-pointer text-sm">Đánh dấu là đã đọc</p>}
        </div>
    </PopoverContent>
}

export default SidebarNotify