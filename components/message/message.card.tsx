"use client"
import { IMessage } from "@/types/message"
import { dateTimeConverter } from "@/utils/dateTimeConverter"
import { FC, Dispatch, SetStateAction } from "react"

import { useRoomContext } from "@/context/Room.context"

import MessageCardMenu from "./message.card.menu"
import { IMAGE_TYPES, VIDEO_TYPES } from "@/constants/file.types"
import useAuthValue from "@/utils/useAuthValue"
import { CiFileOn } from "react-icons/ci"

type Props = {
    message: IMessage,
    setMessageEditor: Dispatch<SetStateAction<IMessage | null>>,
    setMessageReplySender: Dispatch<SetStateAction<IMessage | null>>,
    handleRemoveMessage: (id: string) => void
    prevMessage?: IMessage | null,
    handleReaction: (message: IMessage, emoji: string) => void,
}

const MessageCard: FC<Props> = ({ message, setMessageEditor, handleRemoveMessage, setMessageReplySender, prevMessage, handleReaction }) => {

    const { roomDetail } = useRoomContext()
    const authValue = useAuthValue()
    const memberDetail = roomDetail?.roomUsers.find(item => item.user._id === message.createdBy._id)
    const isSameUser = prevMessage?.createdBy._id === message.createdBy._id

    const counter = message.reactions

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
            {type === "image" && <img src={file} className="w-[350px]" />}
            {type === "document" && <div className="flex items-center space-x-2 rounded-lg py-1 px-2 bg-gray-300">
                <CiFileOn className="text-2xl text-sky-500"/>
                <a href={file} className="text-sky-500">{file.split("_").pop()}</a>
            </div>}
        </div>
    }

    const isSameCreator = authValue?.user._id === message.createdBy._id

    return <MessageCardMenu message={message} setMessageEditor={setMessageEditor} handleRemoveMessage={handleRemoveMessage} setMessageReplySender={setMessageReplySender} handleReaction={handleReaction}>
        <>
        {isSameCreator ? <div id={message._id} className="msg_direction px-7 w-full flex justify-start">

            <div className="msg_container p-2 flex items-start max-w-[500px] space-x-2">

                {!isSameUser ? <img src={message.createdBy.avatar || '/images/default-avatar.jpg'} className="border-2 border-sky-500 w-14 h-14 rounded-full" /> : <div className="w-14"></div>}
                <div className="bg-sky-500 rounded-lg shadow-lg p-3">
                    {message.replyTo && <div className="border-2 px-2 rounded-lg">
                        <p>Trả lời tin nhắn của {message.replyTo.createdBy.fullName}:</p>
                        <p className="text-sm max-w-[500px] text-block-default">{message.replyTo.message}</p>
                        {message.replyTo.file && <FileRender file={message.replyTo.message} />}
                    </div>}
                    {!isSameUser && <p className="font-semibold">{message.createdBy.fullName} <span className="text-xs text-gray-200">{dateTimeConverter(String(message.lastModified))}</span></p>}
                    <p className="text-sm max-w-[500px] text-block-default">{message.message}</p>
                    {message.file && <FileRender file={message.file} />}
                </div>
            </div>
        </div> : <div className="my-1 msg_direction px-7 w-full flex justify-end">
            <div className="msg_container flex items-start max-w-[500px] space-x-2">
                {!isSameUser && <img src={message.createdBy.avatar || '/images/default-avatar.jpg'} className="border-2 border-sky-500 w-14 h-14 rounded-full" />}
                <div className="p-3 bg-white rounded-lg shadow-lg">
                    {message.replyTo && <div className="border-2 px-2 rounded-lg">
                        <p>Trả lời tin nhắn của {message.replyTo.createdBy.fullName}:</p>
                        <p className="text-sm max-w-[500px] text-block-default">{message.replyTo.message}</p>
                        {message.replyTo.file && <FileRender file={message.replyTo.message} />}
                    </div>}
                    {!isSameUser && <p className="font-semibold text-gray-500 text-sm">{message.createdBy.fullName} <span className="text-xs text-gray-400">{dateTimeConverter(String(message.lastModified))}</span></p>}
                    <p className="text-sm max-w-[500px] text-block-default text-black">{message.message}</p>
                    {message.file && <FileRender file={message.file} />}
                </div>
            </div>
        </div>}
        </>
    </MessageCardMenu>
}

export default MessageCard
