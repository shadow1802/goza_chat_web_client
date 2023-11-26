"use client"
import { useAuthState } from "@/context/Auth.context";
import { useRoomContext } from "@/context/Room.context";
import { useSocket } from "@/context/Socket.context";
import useInvoker from "@/utils/useInvoker";
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'
import { ImAttachment } from "react-icons/im"
import { useParams, useRouter } from "next/navigation";
import { FC, FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import InfiniteScroll from 'react-infinite-scroll-component'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import MessageCard from "@/components/message/message.card";
import log from "@/utils/logger";
import { IMessage } from "@/types/message";
import useAuthValue from "@/utils/useAuthValue";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import MediaSender from "@/components/media.sender";
import RoomUsers from "@/components/room/room.users";
import RoomHeader from "@/components/room/room.header";

type Props = {}

const RoomContainer: FC<Props> = (props) => {

    const { room } = useParams()
    const router = useRouter()
    const { socket } = useSocket()
    const { messages, setMessages, roomDetail, messageEditor, setMessageEditor, messageReplySender, setMessageReplySender, setOnlineRoomUsers } = useRoomContext()
    const { authState } = useAuthState()
    const authValue = useAuthValue()
    const messageRef = useRef<HTMLTextAreaElement>(null)
    const formRef = useRef<HTMLFormElement>(null)
    const invoker = useInvoker()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [currentPage, setCurrentPage] = useState<number>(1)
    const [showMediaSender, setShowMediaSender] = useState<boolean>(false)
    const dummy = useRef<HTMLDivElement>(null)

    useEffect(() => {

        socket.emit("join_room", { roomId: room, userId: authValue?.user._id })

        socket.on("receive_join_room", data => {
            setOnlineRoomUsers(data)
        })

        socket.on("receive_leave_room", (data: any) => {
            if (data[room as string]) {
                setOnlineRoomUsers(data[room as string].map((item: any) => item.userId))
            }
        })

        socket.on("receive_chat", (data: IMessage) => {

            if (data.room._id === room) {
                setMessages(prev => {
                    const newListOfMessage = [data, ...prev]
                    return newListOfMessage // uniqueArray
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

        return () => { console.log("lololololololololol") }

    }, [socket])

    const fetchMoreData = async () => {

        setIsLoading(true)

        const nextPage = currentPage + 1

        const { data } = await invoker.get(`/chat/getPaging?room=${room}&pageIndex=${nextPage}`)
        console.log(data.data)

        setMessages(prev => {
            return ([...prev, ...data.data])
        })

        setIsLoading(false)

        setCurrentPage(nextPage)
        console.log(`fetch data page ${nextPage}`)
    }

    const onEmojiPicked = (emoji: EmojiClickData, event: MouseEvent) => {
        if (messageRef.current) {
            messageRef.current.value = `${messageRef.current.value} ${emoji.emoji}`
        }
    }

    const handleSendMesssage = async () => {
        const userIds = roomDetail?.roomUsers.filter(item => item.user._id !== authValue?.user._id).map(item => item.user._id)
        if (messageRef?.current?.value) {
            if (messageEditor) {
                const { data, message, status } = await invoker.put(`/chat/update/${messageEditor._id}`, {
                    message: messageRef?.current?.value
                })
                socket.emit("edit_chat", { updatedMessageObject: data, roomId: room })
                setMessageEditor(null)
                messageRef.current.value = ""
                return
            }
            if (messageReplySender) {
                const { data, message, status } = await invoker.post(`/chat/insert`, {
                    message: messageRef?.current?.value,
                    replyTo: messageReplySender._id,
                    room,
                    type: 1
                })
                socket.emit("insert_chat", { messageObject: data, roomId: room, userIds })
                setMessageReplySender(null)
                dummy.current?.scrollIntoView({ behavior: "smooth" })
                messageRef.current.value = ""
                return
            }
            const { data, message, status } = await invoker.post("/chat/insert", { message: messageRef.current.value, room, type: 1 })
            socket.emit("insert_chat", { messageObject: data, roomId: room, userIds })
            dummy.current?.scrollIntoView({ behavior: "smooth" })
            messageRef.current.value = ""
        }
    }

    const handleSendMessageWithFile = async (message: string, file: string) => {
        const userIds = roomDetail?.roomUsers.filter(item => item.user._id !== authValue?.user._id).map(item => item.user._id)
        console.log(userIds)
        const { data, status } = await invoker.post("/chat/insert", { message, room, type: 1, file })
        socket.emit("insert_chat", { messageObject: data, roomId: room, userIds })
        setShowMediaSender(false)
    }

    const handleRemoveMessage = async (id: string) => {

        const { data, status, message } = await invoker.remove(`/chat/delete/${id}`)
        if (status === 200) {
            socket.emit("remove_chat", { removedMessageId: id, roomId: room })
        }
    }

    const onSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault()
        const form = event.currentTarget
        const elements = form.elements as typeof form.elements & {
            message: { value: string },
        }

        const { message } = elements
        console.log(message)
    }

    const onKeyDown = (event: KeyboardEvent) => {
        if (event.keyCode == 13 && event.shiftKey == false) {
            event.preventDefault()
            handleSendMesssage()
        }
    }

    const handleReaction = async (message: IMessage, emoji: string) => {
        const { data, status } = await invoker.post(`/reaction/insert`, { chatId: message._id, emoji: emoji })
        socket.emit("send_reaction_chat", { message, roomId: room, emoji })
    }

    return <div className="flex-grow min-h-screen overflow-y-hidden text-gray-200">

        <RoomHeader />

        <div className="flex">
            <div className="flex-grow bg-gray-100 border-l-2 bg-cover" style={{ backgroundImage: `url(/images/bg2.png)` }}>
                <div
                    id="scrollableDiv"
                    className="relative pb-10 px-5 scrollbar-thin"
                    style={{
                        height: '84vh',
                        overflow: 'auto',
                        display: 'flex',
                        flexDirection: 'column-reverse',
                    }}
                >
                    <div ref={dummy}></div>
                    <InfiniteScroll
                        dataLength={100}
                        next={fetchMoreData}
                        style={{ display: 'flex', flexDirection: 'column-reverse' }} //To put endMessage and loader to the top.
                        inverse={true} //
                        hasMore={true}
                        loader={
                            isLoading ? <div className="text-white">loading ...</div> : null
                        }
                        scrollableTarget="scrollableDiv"
                        scrollThreshold={0.9}
                    >
                        {messages?.map((mess, index) => <MessageCard
                            key={mess._id}
                            message={mess}
                            setMessageEditor={setMessageEditor}
                            setMessageReplySender={setMessageReplySender}
                            handleRemoveMessage={handleRemoveMessage}
                            prevMessage={index === messages.length - 1 ? null : messages[index + 1]}
                            handleReaction={handleReaction}
                        />)}

                    </InfiniteScroll>
                </div>

                <div className="sticky flex flex-col items-center justify-center space-x-2 bottom-0 w-full min-h-[10vh] px-12">

                    {messageReplySender && <div className="bg-sky-500 relative ml-2 py-2 flex items-center justify-between w-full h-8 px-2">
                        <div className="absolute  right-0 -top-6 bg-red-500 px-4">
                            <p className="font-semibold">Trả lời tin nhắn của {messageReplySender.createdBy.fullName}</p>
                        </div>
                        <p className="text-white text-sm font-semibold">{messageReplySender.message}</p>
                        <img src="/icons/close.svg" onClick={() => setMessageReplySender(null)} className="cursor-pointer w-5 h-5" alt="" />
                    </div>}

                    {messageEditor && <div className="bg-sky-500 relative ml-2 py-2 flex items-center justify-between w-full h-8 px-2">
                        <div className="absolute right-0 -top-6 px-4 border-2 border-sky-500">
                            <p className="font-semibold text-sky-500">Chỉnh sửa tin nhắn</p>
                        </div>
                        <p className="text-sm font-semibold text-white">{messageEditor.message}</p>
                        <img src="/icons/close.svg" onClick={() => setMessageEditor(null)} className="cursor-pointer w-5 h-5" alt="" />
                    </div>}

                    <form ref={formRef} onSubmit={onSubmit} className="flex border-2 border-sky-500 justify-between items-center w-full bg-gray-100 p-2">
                        <textarea ref={messageRef} style={{ resize: 'none' }} placeholder="Vui lòng nhập tin nhắn" onKeyDown={onKeyDown} className="px-2 text-gray-700 scrollbar-thin flex border-none outline-none items-center h-6 w-full bg-transparent" />
                        <div className="flex space-x-2">

                            <Popover>
                                <PopoverTrigger asChild>
                                    <img className="cursor-pointer" src="/icons/emoji.svg" alt="" />
                                </PopoverTrigger>
                                <PopoverContent className="w-[390px] bg-transparent border-none p-0">
                                    <EmojiPicker onEmojiClick={onEmojiPicked} />
                                </PopoverContent>
                            </Popover>

                            <Dialog open={showMediaSender} onOpenChange={setShowMediaSender}>
                                <DialogTrigger>
                                    <ImAttachment className="cursor-pointer text-xl text-sky-500" />
                                </DialogTrigger>
                                <DialogContent className="p-0 border-0 w-[500px]">
                                    <MediaSender handleSendMessageWithFile={handleSendMessageWithFile} />
                                </DialogContent>
                            </Dialog>
                        </div>
                    </form>
                </div >
            </div>
            <RoomUsers />
        </div>
    </div >
}

export default RoomContainer