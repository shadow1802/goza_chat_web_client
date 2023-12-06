"use client"
import { FC, FormEvent, useEffect, useRef, useState } from "react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { motion } from "framer-motion"
import { useLobbyContext } from "@/context/Lobby.context"
import useInvoker from "@/utils/useInvoker"
import { IMessage } from "@/types/message"
import { useSocket } from "@/context/Socket.context"
import { useAuthState } from "@/context/Auth.context"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import InfiniteScroll from "react-infinite-scroll-component"
import ChatScreenMessageCard from "./chat_screen.message"
import MediaSender from "../media.sender"
import useAuthValue from "@/utils/useAuthValue"
import { IRoomDetail } from "@/types/room.detail"
import { AiOutlineClose } from "react-icons/ai"
import { GoScreenFull, GoScreenNormal } from "react-icons/go"
import { IoCall } from "react-icons/io5"


type Props = {
    roomDetail: IRoomDetail | null
}

const ChatScreen: FC<Props> = ({ roomDetail }) => {
    const { setShowChatScreen } = useLobbyContext()
    const [showMediaSender, setShowMediaSender] = useState<boolean>(false)
    const { authState } = useAuthState()
    const { socket } = useSocket()
    const authValue = useAuthValue()
    const [messages, setMessages] = useState<IMessage[]>([])
    const [fullScreen, setFullScreen] = useState<boolean>(false)
    const messageRef = useRef<HTMLInputElement>(null)
    const invoker = useInvoker()

    const getMessages = async () => {
        const { data } = await invoker.get(`/chat/getPaging?room=${roomDetail?._id}`)
        setMessages(data.data)
    }

    useEffect(() => {

        console.log(roomDetail)

        if (roomDetail?._id) {
            socket.emit("join_room", { roomId: roomDetail?._id, userId: authState?.user._id })
        }

        getMessages()

        socket.on("receive_join_room", data => console.log("receive_join_room", data))

        socket.on("receive_chat", (data: IMessage) => {
            if (data.room._id === roomDetail?._id) {
                setMessages(prev => {
                    const newListOfMessage = [data, ...prev]
                    return newListOfMessage//uniqueArray
                })
            }
        })

        socket.on("receive_edit_chat", (data: IMessage) => {

            setMessages(prev => {
                const editMessageObjectIndex = [...prev].findIndex(item => item._id == data._id)
                const newMessage = [...prev]
                newMessage[editMessageObjectIndex] = data
                return newMessage
            })
        })

        socket.on("receive_reaction_chat", (data) => {
            console.log(data)
        })

        socket.on("receive_remove_chat", (data: { msg: string, removedMessageId: string }) => {
            setMessages(prev => {
                const newMessage = [...prev].filter(item => item._id !== data.removedMessageId)
                return newMessage
            })
        })

        return () => { socket.emit("exit_room", { roomId: roomDetail?._id, userId: authState?.user._id }) }
    }, [roomDetail, socket])

    const members = roomDetail?.roomUsers.map(item => item.user._id).filter(item => item !== authValue?.user._id)

    const handleSendMesssage = async (event: FormEvent) => {

        event.preventDefault()

        if (messageRef?.current?.value) {

            const { data, message, status } = await invoker.post("/chat/insert", { message: messageRef.current.value, room: roomDetail?._id, type: 1 })
            console.log(data)
            socket.emit("insert_chat", { messageObject: data, roomId: roomDetail?._id, userIds: members })

            messageRef.current.value = ""

            if (roomDetail && authValue) {
                await invoker.ring({ 
                    userIds: roomDetail.roomUsers.map(item => item.user._id),
                    title: authValue.user.fullName,
                    body: data.message
                })
            }
        }
    }

    const handleSendMessageWithFile = async (message: string, file: string) => {
        const userIds = roomDetail?.roomUsers.filter(item => item.user._id !== authValue?.user._id).map(item => item.user._id)
        const { data, status } = await invoker.post("/chat/insert", { message, room: roomDetail?._id, type: 2, file })
        socket.emit("insert_chat", { messageObject: data, roomId: roomDetail?._id })
        setShowMediaSender(false)
    }

    const target = roomDetail?.roomUsers.find(item => item.user._id !== authValue?.user._id)

    return <motion.div drag className={`fixed flex flex-col rounded-lg z-20 ${fullScreen ? "top-0 left-0 w-screen min-h-screen" : "w-[25vw] bottom-16 right-6"} bg-white shadow-xl drop-shadow-xl`}>
        <div className="chat_screen_header bg-gradient-to-r from-cyan-500 to-blue-500 items-center rounded-t-md flex space-x-2 justify-between px-2 py-1">
            <div className="flex space-x-2">
                <img src={target?.user.avatar} alt="" className="border-2 border-cyan-400 shadow-xl rounded-full w-9 h-9" />
                <div className="flex flex-col">
                    <span className="text-sm text-white font-semibold">{target?.user.fullName}</span>
                    <small className="leading-3 text-xs text-gray-200 font-semibold">@{target?.user.username}</small>
                </div>
            </div>
            <div className="flex space-x-2">
                <IoCall className="cursor-pointer text-gray-600" />
                {fullScreen ? <GoScreenNormal className="text-gray-100 cursor-pointer" onClick={() => setFullScreen(false)} /> : <GoScreenFull className="text-gray-100 cursor-pointer" onClick={() => setFullScreen(true)} />}
                <AiOutlineClose onClick={() => setShowChatScreen(prev => !prev)} className="cursor-pointer text-gray-100 text-lg" />
            </div>
        </div>

        <div
            id="scrollableDiv"
            className={`relative pb-10 scrollbar-thin overflow-y-auto ${fullScreen && "px-20"}`}
            style={{
                height: fullScreen ? '90vh' : 500,
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column-reverse',
            }}
        >
            <InfiniteScroll
                dataLength={100}
                next={() => console.log("get more...")}
                style={{ display: 'flex', flexDirection: 'column-reverse' }} //To put endMessage and loader to the top.
                inverse={true} //1


                hasMore={true}
                loader={<div className="text-white">loading ...</div>}
                scrollableTarget="scrollableDiv"
                scrollThreshold={0.9}
            >
                {messages?.map((mess, index) => <ChatScreenMessageCard key={mess._id} message={mess} />)}

            </InfiniteScroll>

        </div>

        <div className={`chat_screen_footer ${fullScreen ? "py-2 px-20" : "p-2"}`}>
            <form onSubmit={handleSendMesssage} className="flex justify-between w-full rounded-lg shadow-white bg-gray-200 shadow-md drop-shadow-md p-1">
                <input ref={messageRef} type="text" placeholder="Nhập tin nhắn để gửi" className="w-[90%] border-none text-sm bg-gray-200 px-2 text-gray-700 outline-none" />
                <div className="flex space-x-1 items-center">

                    <Dialog open={showMediaSender} onOpenChange={setShowMediaSender}>
                        <DialogTrigger>
                            <img src="/icons/attach.svg" alt="" />
                        </DialogTrigger>
                        <DialogContent className="p-0 border-0 w-[500px]">
                            <MediaSender handleSendMessageWithFile={handleSendMessageWithFile} />
                        </DialogContent>
                    </Dialog>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger><img src="/icons/emoji.svg" alt="" /></TooltipTrigger>
                            <TooltipContent>
                                <p>Tính năng đang phát triển</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </form>
        </div>
    </motion.div>
}

export default ChatScreen