"use client"

import { useRoomContext } from "@/context/Room.context"
import useInvoker from "@/utils/useInvoker"
import { FC } from "react"

type Props = {

}

const AnouncementSender: FC<Props> = (props) => {

    const invoker = useInvoker()
    const { roomDetail } = useRoomContext()

    const onSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
        const form = event.currentTarget
        const { anouncement } = form.elements as typeof form.elements & {
            anouncement: { value: string }
        }

        const { data, message, status } = await invoker.post("/room/notify/create", {
            roomId: roomDetail?._id,
            message: anouncement.value
        })

        console.log(data, message, status)

    }

    return <div className="">
        <div className="anouncementSender_header bg-gradient-to-r py-3 from-cyan-500 to-blue-500 flex w-full px-4">
            <p className="text-white font-semibold">Gửi thông báo</p>
        </div>

        <form onSubmit={onSubmit} className="p-4">
            <textarea name="anouncement" className="p-2 text-gray-600 w-full border-2 h-60" />
            <button className="w-full py-1 bg-sky-500 text-white font-semibold">Gửi</button>
        </form>

    </div>
}

export default AnouncementSender