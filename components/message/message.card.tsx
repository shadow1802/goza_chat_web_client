"use client"
import { IMessage } from "@/types/message"
import { FC, Dispatch, SetStateAction } from "react"
import { useRoomContext } from "@/context/Room.context"
import MessageCardMenu from "./message.card.menu"
import { IMAGE_TYPES, VIDEO_TYPES } from "@/constants/file.types"
import useAuthValue from "@/utils/useAuthValue"
import { CiFileOn } from "react-icons/ci"
import { useSocket } from "@/context/Socket.context"
import Avatar from "../useful/avatar"
import { Reaction } from "@/types/reaction"
import { usePlayer } from "@/context/Player.context"
import LazyLoad from 'react-lazy-load'

type Props = {
    message: IMessage,
    setMessageEditor: Dispatch<SetStateAction<IMessage | null>>,
    setMessageReplySender: Dispatch<SetStateAction<IMessage | null>>,
    handleRemoveMessage: (id: string) => void
    prevMessage?: IMessage | null,
    handleReaction: (message: IMessage, emoji: string, cb?: (msg: IMessage) => void) => Promise<void>,
}

const MessageCard: FC<Props> = ({ message, setMessageEditor, handleRemoveMessage, setMessageReplySender, prevMessage, handleReaction }) => {

    const { roomDetail } = useRoomContext()
    const { setImagePlayerData } = usePlayer()
    const authValue = useAuthValue()
    // const memberDetail = roomDetail?.roomUsers.find(item => item.user._id === message.createdBy._id)
    const isSameUser = prevMessage?.createdBy._id === message.createdBy._id

    // const counter = message.reactions

    const FileRender: FC<{ file: string }> = ({ file }) => {
        let type = "document"
        const ext = file.split(".").pop()
        if (ext && IMAGE_TYPES.includes(ext.toLowerCase())) {
            type = "image"
        }
        if (ext && VIDEO_TYPES.includes(ext.toLowerCase())) {
            type = "video"
        }

        return <div>
            {type === "video" && <video className="w-[350px]" src={file} controls></video>}
            {type === "image" && <img onClick={()=>setImagePlayerData([{
                original: file,
                thumbnail: file
            }])} src={file} className="cursor-pointer w-[350px]" />}
            {type === "document" && <div className="flex items-center space-x-2 rounded-lg py-1 px-2 bg-gray-300">
                <CiFileOn className="text-2xl text-sky-500" />
                <a href={file} className="text-sky-500">{file.split("_").pop()}</a>
            </div>}
        </div>
    }

    const isSameCreator = authValue?.user._id === message.createdBy._id

    return <MessageCardMenu message={message} setMessageEditor={setMessageEditor} handleRemoveMessage={handleRemoveMessage} setMessageReplySender={setMessageReplySender} handleReaction={handleReaction}>
        <div>
            {isSameCreator ? <div id={message._id} className="msg_direction px-7 w-full flex justify-start">
                <div className="msg_container p-2 flex items-start max-w-[500px] space-x-2">

                    {!isSameUser ? <Avatar className="border-2 border-sky-500 w-12 h-12 rounded-full" name={message.createdBy.fullName} src={message.createdBy.avatar}/> : <div className="w-14"></div>}
                    <div className="bg-black bg-opacity-25 rounded-lg shadow-lg px-3 py-[0.3rem]">
                        {!isSameUser && <p className="cursor-pointer font-semibold text-sm">{message.createdBy.fullName}</p>}
                        {message.replyTo && <div className="border-l-[2px] bg-black bg-opacity-25 border-white px-2 rounded-md">
                            <p className="text-xs font-semibold">{message.replyTo.createdBy.fullName}</p>
                            <p className="text-xs max-w-[500px] text-block-default">{message.replyTo.message}</p>
                            {message.replyTo.file && <FileRender file={message.replyTo.message} />}
                        </div>}
                        <p className="text-sm max-w-[500px] text-block-default">{message.message}</p>
                        {message.file && <FileRender file={message.file} />}
                        {message.reactions.map((item: Reaction, index) => <p key={index}>{item.emoji}</p>)}
                    </div>
                </div>
            </div> : <div className="my-1 msg_direction px-7 w-full flex justify-end">
                <div className="msg_container flex items-start max-w-[500px] space-x-2">
                    {!isSameUser && <Avatar className="border-2 w-12 h-12 rounded-full" name={message.createdBy.fullName} src={message.createdBy.avatar}/>}
                    <div className="relative px-3 py-[0.28rem] bg-white bg-opacity-30 rounded-lg shadow-lg">
                        {!isSameUser && <p className="font-semibold text-gray-600 text-sm">{message.createdBy.fullName}</p>}
                        {message.replyTo && <div className="border-l-[2px] bg-white bg-opacity-30 border-white px-2 rounded-md">
                            <p className="text-xs font-semibold text-gray-600">{message.replyTo.createdBy.fullName}</p>
                            <p className="text-xs max-w-[500px] text-gray-600 text-block-default">{message.replyTo.message}</p>
                            {message.replyTo.file && <FileRender file={message.replyTo.message} />}
                        </div>}
                        <p className="text-sm max-w-[500px] text-block-default text-black">{message.message}</p>
                        {message.file && <FileRender file={message.file} />}
                        {message.reactions.map((item: Reaction, index) => <p key={index}>{item.emoji}</p>)}
                    </div>
                </div>
            </div>}
        </div>
    </MessageCardMenu>
}

export default MessageCard
