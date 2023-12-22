"use client"
import { IAnouncement } from "@/types/anouncement"
import { IMessage } from "@/types/message"
import { IRoom } from "@/types/room"
import { IRoomDetail } from "@/types/room.detail"
import useInvoker from "@/utils/useInvoker"
import { useParams } from "next/navigation"
import { createContext, useContext, useState, Dispatch, SetStateAction, useEffect } from "react"

const RoomContext = createContext<{
    messages: IMessage[],
    setMessages: Dispatch<SetStateAction<IMessage[]>>,
    roomDetail: IRoomDetail | null | undefined,
    messageEditor: IMessage | null,
    messageReplySender: IMessage | null,
    setMessageEditor: Dispatch<SetStateAction<IMessage | null>>,
    setMessageReplySender: Dispatch<SetStateAction<IMessage | null>>,
    onlineRoomUsers: string[],
    anouncements: IAnouncement[],
    setAnouncements: Dispatch<SetStateAction<IAnouncement[]>>,
    setRoomDetail: Dispatch<SetStateAction<IRoomDetail | null>>,
    setOnlineRoomUsers: Dispatch<SetStateAction<string[]>>,
    reloader: { anouncements: () => Promise<void>, roomDetail: () => Promise<void> }
}>({
    messages: [],
    setMessages: () => null,
    roomDetail: null,
    messageEditor: null,
    messageReplySender: null,
    setMessageEditor: () => null,
    setMessageReplySender: () => null,
    onlineRoomUsers: [],
    anouncements: [],
    setAnouncements: () => null,
    setOnlineRoomUsers: () => null,
    setRoomDetail: () => null,
    reloader: { anouncements: () => new Promise((res, rej) => null), roomDetail: () => new Promise((res, rej) => null) }
})

type Props = {
    children: React.ReactNode
}

function RoomProvider({ children }: Props) {
    const { room } = useParams()
    const invoker = useInvoker()
    const [loading, setLoading] = useState<boolean>(true)
    const [messages, setMessages] = useState<IMessage[]>([])
    const [roomDetail, setRoomDetail] = useState<IRoomDetail | null>(null)
    const [onlineRoomUsers, setOnlineRoomUsers] = useState<string[]>([])
    const [messageEditor, setMessageEditor] = useState<IMessage | null>(null)
    const [messageReplySender, setMessageReplySender] = useState<IMessage | null>(null)
    const [anouncements, setAnouncements] = useState<IAnouncement[]>([])

    const reloader = {
        anouncements: async () => {
            const { data } = await invoker.get(`/room/notify/paging?roomId=${room}`)
            setAnouncements(data.data)
        },
        roomDetail: async () => {
            const { data } = await invoker.get(`/room/getRoomById/${room}`)
            console.log(data)
            setRoomDetail(data)
        },
        messages: async () => {
            const { data: { data } } = await invoker.get(`/chat/getPaging?room=${room}`)
            setMessages(data)
        }
    }

    useEffect(() => {
        const loader = async () => {
            await Promise.all([
                reloader.anouncements(),
                reloader.messages(),
                reloader.roomDetail()
            ])
            setLoading(false)
        }
        loader()
    }, [room])

    return <RoomContext.Provider value={{
        setRoomDetail,
        messages,
        setMessages,
        roomDetail,
        messageEditor,
        messageReplySender,
        setMessageEditor,
        setMessageReplySender,
        onlineRoomUsers,
        setOnlineRoomUsers,
        anouncements,
        setAnouncements,
        reloader
    }}>
        {children}
        {loading && <div className="fixed top-[45%] left-[50%] z-20">
            <img src="/icons/loading.svg" alt="" />
        </div>}
    </RoomContext.Provider>
}

export const useRoomContext = () => useContext(RoomContext)

export default RoomProvider