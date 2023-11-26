"use client"
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
    setRoomDetail: Dispatch<SetStateAction<IRoomDetail | null>>, 
    setOnlineRoomUsers: Dispatch<SetStateAction<string[]>>,
}>({
    messages:[], 
    setMessages: () => null,
    roomDetail: null,
    messageEditor: null,
    messageReplySender: null,
    setMessageEditor: () => null,
    setMessageReplySender: () => null,
    onlineRoomUsers: [],
    setOnlineRoomUsers: () => null,
    setRoomDetail: () => null
})

type Props = {
    initialMessages: IMessage[]
    initialRoomDetail: any
    children: React.ReactNode
}

function RoomProvider ({ initialMessages, initialRoomDetail, children }: Props) {

    const [messages, setMessages] = useState<IMessage[]>(initialMessages)
    const [roomDetail, setRoomDetail] = useState<IRoomDetail | null>(initialRoomDetail)
    const [onlineRoomUsers, setOnlineRoomUsers] = useState<string[]>([])
    const [messageEditor, setMessageEditor] = useState<IMessage | null>(null)
    const [messageReplySender, setMessageReplySender] = useState<IMessage | null>(null)

    return <RoomContext.Provider value={{ setRoomDetail, messages, setMessages, roomDetail, messageEditor, messageReplySender, setMessageEditor, setMessageReplySender, onlineRoomUsers, setOnlineRoomUsers }}>
        { children }
    </RoomContext.Provider>
}

export const useRoomContext = () => useContext(RoomContext)

export default RoomProvider