import { IMessage } from "@/types/message"
import { dateTimeConverter } from "@/utils/dateTimeConverter"
import { FC, Dispatch, SetStateAction } from "react"
import Menu from "../menu"
import { useRoomContext } from "@/context/Room.context"
import { FaHeart, FaSadCry, FaAngry, FaSmile } from "react-icons/fa"
import log from "@/utils/logger"
import MessageCardMenu from "./message.card.menu"
import { IoReturnDownForwardSharp } from "react-icons/io5"
import { ROOM_ROLES_COLORS } from "@/constants/room.roles"
import { IMAGE_TYPES, VIDEO_TYPES } from "@/constants/file.types"
import useAuthValue from "@/utils/useAuthValue"

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
        if (ext && IMAGE_TYPES.includes(ext)) {
            type = "image"
        }
        if (ext && VIDEO_TYPES.includes(ext)) {
            type = "video"
        }

        return <div>
            {type === "video" && <video className="w-[300px]" src={file} controls></video>}
            {type === "image" && <img src={file} className="w-[300px]" />}
        </div>
    }

    const isSelf = authValue?.user._id === message.createdBy._id

    return <MessageCardMenu message={message} setMessageEditor={setMessageEditor} handleRemoveMessage={handleRemoveMessage} setMessageReplySender={setMessageReplySender} handleReaction={handleReaction}>
        <div className={`message_direction px-8 w-full mt-2 flex ${isSelf?"justify-start":"justify-end"}`}>
            <div className={`message_container ${isSelf?"bg-sky-500":"bg-white"} shadow-lg rounded-lg max-w-[500px] p-2 flex space-x-2`}>
                {isSameUser ? null : <div className="">
                    <img src={message.createdBy.avatar || "/images/default-avatar.jpg"} className="w-12 h-12 rounded-full" alt="" />
                </div>}
                <div>
                    { !isSameUser && <p className="font-semibold text-sm text-sky-500">{message.createdBy.fullName} <span className="text-xs text-gray-400">{dateTimeConverter(String(message.createdTime))}</span></p>}
                    <p className="text-sm text-gray-600">{message.message}</p>
                </div>
            </div>
        </div>
    </MessageCardMenu>
}

export default MessageCard