"use client"
import { MdPhotoLibrary } from "react-icons/md"
import { useRoomContext } from "@/context/Room.context";
import { useSocket } from "@/context/Socket.context";
import useInvoker from "@/utils/useInvoker";
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'
import { useParams } from "next/navigation";
import { FC, KeyboardEvent, useEffect, useRef, useState } from "react";
import { IoIosCloseCircleOutline, IoIosSend } from "react-icons/io"
import InfiniteScroll from 'react-infinite-scroll-component'
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import MessageCard from "@/components/message/message.card";
import { IMessage } from "@/types/message";
import useAuthValue from "@/utils/useAuthValue";
import { Sheet, SheetTrigger } from "@/components/ui/sheet"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import MediaSender from "@/components/media.sender";
import RoomUsers from "@/components/room/room.users";
import RoomHeader from "@/components/room/room.header";
import AnouncementSender from "@/components/anouncement.sender";
import RoomAnouncements from "@/components/room/room.anouncements";
import isBlank from "@/utils/isBlank";
import { toast } from "@/components/ui/use-toast";
import { truncate } from "@/utils/helper";
import MediaViewer from "@/components/media/viewer";

type Props = {}

const RoomContainer: FC<Props> = (props) => {

    const { room } = useParams()
    const { socket } = useSocket()
    const { messages, setMessages, roomDetail, messageEditor, setMessageEditor, messageReplySender, setMessageReplySender, setOnlineRoomUsers, reloader } = useRoomContext()
    const authValue = useAuthValue()
    const messageRef = useRef<HTMLTextAreaElement>(null)
    const formRef = useRef<HTMLFormElement>(null)
    const messagesRef = useRef<HTMLDivElement>(null)
    const invoker = useInvoker()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [currentPage, setCurrentPage] = useState<number>(1)
    const [showMediaSender, setShowMediaSender] = useState<boolean>(false)
    const [showAnouncementSender, setShowAnouncementSender] = useState<boolean>(false)
    const [showMediaLibrary, setShowMediaLibrary] = useState<boolean>(false)
    const dummy = useRef<any>(null)

    useEffect(() => {

        socket.emit("join_room", { roomId: room, userId: authValue?.user._id })

        socket.on("receive_join_room", (data: { room: string, users: string[] }) => {
            if (data.room === room) {

                setOnlineRoomUsers(data.users)
            }
        })

        socket.on("receive_send_anouncement", () => {
            reloader.anouncements()
        })

        socket.on("receive_leave_room", (data: any) => {
            if (data[room as string]) {
                setOnlineRoomUsers(data[room as string].map((item: any) => item.userId))
            }
        })

        socket.on("receive_chat", (data: IMessage) => {
            if (data.room === room) {
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

            setMessages(prev => {
                const editMessageObjectIndex = [...prev].findIndex(item => item._id == data.message._id)
                const newMessage = [...prev]

                console.log(newMessage[editMessageObjectIndex].reactions)

                newMessage[editMessageObjectIndex].reactions = data.message.reactions
                return newMessage
            })

        })

        socket.on("receive_exit_room", (data: { room: string, users: string[] }) => {
            if (data.room === room) {

                setOnlineRoomUsers(data.users)
            }
        })

        socket.on("receive_user_disconnect", (data: { [key: string]: string[] }) => {
            setOnlineRoomUsers(data[room as string])
        })

        socket.on("receive_remove_chat", (data: { msg: string, removedMessageId: string }) => {
            setMessages(prev => {
                const newMessage = [...prev].filter(item => item._id !== data.removedMessageId)
                return newMessage
            })
        })

        return () => {
            socket.emit("exit_room", { roomId: room, userId: authValue?.user._id })
        }

    }, [socket])

    const fetchMoreData = async () => {

        setIsLoading(true)

        const nextPage = currentPage + 1

        const { data } = await invoker.get(`/chat/getPaging?room=${room}&pageIndex=${nextPage}`)

        setMessages(prev => {
            return ([...prev, ...data.data])
        })

        setIsLoading(false)

        setCurrentPage(nextPage)
    }

    const onEmojiPicked = (emoji: EmojiClickData, event: MouseEvent) => {
        if (messageRef.current) {
            messageRef.current.value = `${messageRef.current.value} ${emoji.emoji}`
        }
    }

    const handlePinMessage = async () => {
        
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
                messageRef.current.value = ""
                return
            }

            if (isBlank(messageRef.current.value)) {
                toast({ title: "Không thể gửi tin nhắn", duration: 2000, description: <p className="text-red-500">Tin nhắn không được bao gồm toàn bộ là khoảng trắng</p> })
                return
            }

            const { data, message, status } = await invoker.post("/chat/insert", { message: messageRef.current.value, room, type: 1 })
            socket.emit("insert_chat", { messageObject: data, roomId: room, userIds })
            // dummy?.current?.scrollIntoView({ behavior: "smooth" })
            messageRef.current.value = ""
            if (authValue && roomDetail) {
                await invoker.ring({
                    title: data.createdBy.fullName,
                    body: data.message,
                    userIds: roomDetail.roomUsers.map(item => item.user._id),
                    image: "",
                    clickAction: `IN_CHAT_ROOM_${roomDetail._id}`
                })
            }

            messagesRef?.current?.scrollTo({ top: messagesRef?.current?.scrollHeight, behavior: "smooth" })

        }
    }

    const handleSendMessageWithFile = async (message: string, file: string) => {
        const userIds = roomDetail?.roomUsers.filter(item => item.user._id !== authValue?.user._id).map(item => item.user._id)
        const { data, status } = await invoker.post("/chat/insert", { message, room, type: 2, file })
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
    }

    const onKeyDown = (event: KeyboardEvent) => {
        if (event.keyCode == 13 && event.shiftKey == false) {
            event.preventDefault()
            handleSendMesssage()
        }
    }

    const handleReaction = async (message: IMessage, emoji: string) => {
        try {
            const { data, status } = await invoker.post(`/reaction/insert`, { chatId: message._id, emoji: emoji })

            socket.emit("send_reaction_chat", { message: data, roomId: room, emoji })
        } catch (err) {
            console.log(err)
        }
    }

    return <div className="flex-grow min-h-screen overflow-y-hidden text-gray-200">

        <RoomHeader />

        <div className="flex">
            <div className="hehe bg-cover flex-grow border-l-2">
                <RoomAnouncements showAnouncementSender={showAnouncementSender} setShowAnouncementSender={setShowAnouncementSender}/>
                <div
                    id="messages_container"
                    className="relative pb-0 px-5"
                    ref={messagesRef}
                    style={{
                        height: '74.2vh',
                        overflow: 'auto',
                        display: 'flex',
                        flexDirection: 'column-reverse',
                    }}
                >
                    <InfiniteScroll

                        dataLength={100}
                        next={fetchMoreData}
                        style={{ display: 'flex', flexDirection: 'column-reverse', position: "relative" }} //To put endMessage and loader to the top.
                        inverse={true} //
                        hasMore={true}
                        loader={
                            isLoading ? <div className="text-white">loading ...</div> : null
                        }
                        scrollableTarget="messages_container"
                        scrollThreshold={0.9}
                    >

                        <div className="h-0 w-full bg-red-500 bottom-0" ref={dummy}></div>

                        {messages?.map((mess, index) => {
                            return <MessageCard
                                key={mess._id}
                                message={mess}
                                setMessageEditor={setMessageEditor}
                                setMessageReplySender={setMessageReplySender}
                                handleRemoveMessage={handleRemoveMessage}
                                prevMessage={index === messages.length - 1 ? null : messages[index + 1]}
                                handleReaction={handleReaction}
                            />
                        })}

                    </InfiniteScroll>
                </div>

                <div className="sticky flex flex-col items-center justify-center space-x-2 bottom-0 w-full min-h-[15.8vh] px-12">


                    {/* (!messageReplySender && !messageEditor) && (<div className="pb-1 w-full flex items-center">
                        <button className="px-2 py-1 bg-red-500 text-white ">Buzz !!!</button>
                    </div>) */}

                    {messageReplySender && <div className="mb-1 bg-sky-500 rounded-md relative ml-2 py-2 flex items-center justify-between w-full h-8 px-2">
                        <p className="text-white w-full pr-2 text-sm font-semibold flex items-center justify-between">
                            <span>{truncate(messageReplySender.message, 100)}</span>
                            <span className="text-sm text-gray-200">Chỉnh sửa tin nhắn {messageReplySender.createdBy.fullName}</span>
                        </p>
                        <IoIosCloseCircleOutline onClick={() => setMessageReplySender(null)} className="cursor-pointer w-5 h-5" alt="" />
                    </div>}

                    {messageEditor && <div className="mb-1 bg-sky-500 rounded-md relative ml-2 py-2 flex items-center justify-between w-full h-8 px-2">
                        <p className="text-white w-full pr-2 text-sm font-semibold flex items-center justify-between">
                            <span>{truncate(messageEditor.message, 100)}</span>
                            <span className="text-sm text-gray-200">Trả lời tin nhắn của {messageEditor.createdBy.fullName}</span>
                        </p>
                        <IoIosCloseCircleOutline onClick={() => setMessageEditor(null)} className="cursor-pointer w-5 h-5" alt="" />
                    </div>}

                    <form ref={formRef} onSubmit={onSubmit} className="flex pl-2 rounded-md justify-between items-center w-full bg-sky-500 shadow-lg h-14">
                        <div className="px-3 relative w-full flex bg-gray-100 items-center rounded-r-full">
                            <textarea ref={messageRef}
                                style={{ resize: 'none' }}
                                placeholder="Vui lòng nhập tin nhắn"
                                onKeyDown={onKeyDown}
                                className="px-2 rounded-l-md bg-gray-100 pt-[8px] rounded-lg text-gray-700 text-sm scrollbar-thin flex flex-col justify-center border-none outline-none items-center h-10 w-full"
                            />
                            <button onClick={handleSendMesssage} className="absolute flex pr-[2px] items-center justify-center right-2 w-7 h-7 bg-sky-500 rounded-full hover:scale-110 duration-200">
                                <IoIosSend className="text-white text-xl" />
                            </button>
                        </div>

                        <div className="flex justify-between items-center space-x-3 bg-sky-500 px-4 py-2">

                            <Popover>
                                <PopoverTrigger asChild>
                                    <img src="/icons/emoji.svg" className="w-6 hover:scale-[120%] duration-200 cursor-pointer" alt="" />
                                </PopoverTrigger>
                                <PopoverContent className="w-[390px] bg-transparent border-none p-0">
                                    <EmojiPicker onEmojiClick={onEmojiPicked} />
                                </PopoverContent>
                            </Popover>

                            <Dialog open={showMediaSender} onOpenChange={setShowMediaSender}>
                                <DialogTrigger>
                                    <img src="/icons/attach.svg" className="w-6 hover:scale-[120%] duration-200" alt="" />
                                </DialogTrigger>
                                <DialogContent className="p-0 border-0 w-[500px]">
                                    <MediaSender handleSendMessageWithFile={handleSendMessageWithFile} />
                                </DialogContent>
                            </Dialog>

                            <Sheet modal={false} open={showMediaLibrary} onOpenChange={setShowMediaLibrary}>
                                <SheetTrigger asChild>
                                    <MdPhotoLibrary onClick={(() => setShowMediaLibrary(true))} className="hover:scale-[120%] duration-200 cursor-pointer text-3xl text-white" />
                                </SheetTrigger>
                                <MediaViewer isOpen={showMediaLibrary} />
                            </Sheet>
                        </div>
                    </form>
                </div >
            </div>
            <RoomUsers />
        </div>
    </div >
}

export default RoomContainer