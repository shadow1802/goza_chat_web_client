import { IMessage } from "@/types/message"
import { dateTimeConverter } from "@/utils/dateTimeConverter"
import { FC, Dispatch, SetStateAction, ReactNode } from "react"
import { useRoomContext } from "@/context/Room.context"
import { FaFaceAngry, FaFaceGrinBeam, FaFaceGrinStars, FaFaceSadCry, FaHeart, FaLocationPin, FaPen, FaReply, FaTrashCan } from "react-icons/fa6"
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"

type Props = {
    message: IMessage,
    setMessageEditor: Dispatch<SetStateAction<IMessage | null>>
    setMessageReplySender: Dispatch<SetStateAction<IMessage | null>>
    handleRemoveMessage: (id: string) => void
    handleReaction: (message: IMessage, emoji: string) => void
    children: ReactNode
}

const MessageCardMenu: FC<Props> = ({ message, setMessageEditor, handleRemoveMessage, setMessageReplySender, handleReaction, children }) => {

    return <ContextMenu>
        <ContextMenuTrigger>{children}</ContextMenuTrigger>
        <ContextMenuContent className="bg-white rounded-md min-w-[300px] p-0 shadow-lg drop-shadow-lg">
            <div className="bg-sky-500 flex space-x-3 px-4 py-2 items-center justify-between">
                <div>
                    <p className="text-sm text-white font-semibold">{message.createdBy.fullName}</p>
                    <p className="text-xs text-gray-200 leading-3">@testdv01</p>
                </div>
                <img src={message.createdBy.avatar} className="w-11 h-11 rounded-full border-2 border-white" alt="" />
            </div>
            <div>
                <ContextMenuItem onClick={() => setMessageEditor(message)} className="group w-full hover:bg-sky-500 duration-300 bg-white flex items-center justify-between px-4 py-2">
                    <p className="text-sky-500 group-hover:text-white text-sm font-semibold">Chỉnh sửa tin nhắn</p>
                    <FaPen className="text-sky-500 group-hover:text-white" />
                </ContextMenuItem>

                <ContextMenuItem onClick={() => setMessageReplySender(message)} className="group w-full hover:bg-sky-500 duration-300 bg-white flex items-center justify-between px-4 py-2">
                    <p className="text-sky-500 group-hover:text-white text-sm font-semibold">Trả lời tin nhắn</p>
                    <FaReply className="text-sky-500 group-hover:text-white" />
                </ContextMenuItem>

                <ContextMenuItem className="group w-full hover:bg-sky-500 duration-300 bg-white flex items-center justify-between px-4 py-2">
                    <p className="text-sky-500 group-hover:text-white text-sm font-semibold">Ghim tin nhắn</p>
                    <FaLocationPin className="text-sky-500 group-hover:text-white" />
                </ContextMenuItem>

                <ContextMenuItem onClick={()=>handleRemoveMessage(message._id)} className="group w-full hover:bg-sky-500 duration-300 bg-white flex items-center justify-between px-4 py-2">
                    <p className="text-sky-500 group-hover:text-white text-sm font-semibold">Xóa tin nhắn</p>
                    <FaTrashCan className="text-red-500 group-hover:text-red-600" />
                </ContextMenuItem>

            </div>
            <div className="flex items-center justify-evenly px-5 py-3 border-t-2 border-sky-500">

                <ContextMenuItem onClick={() => handleReaction(message, "😁")} className="bg-none hover:bg-none focus:bg-none">
                    <FaFaceGrinBeam className="text-yellow-400 text-3xl cursor-pointer hover:scale-[123%] duration-300" />
                </ContextMenuItem>

                <ContextMenuItem onClick={() => handleReaction(message, "🤩")} className="bg-none hover:bg-none focus:bg-none">
                    <FaFaceGrinStars className="text-yellow-500 text-3xl cursor-pointer hover:scale-[123%] duration-300" />
                </ContextMenuItem>

                <ContextMenuItem onClick={() => handleReaction(message, "❤️")} className="bg-none hover:bg-none focus:bg-none">
                    <FaHeart className="text-red-400 text-4xl cursor-pointer hover:scale-[123%] duration-300" />
                </ContextMenuItem>

                <ContextMenuItem onClick={() => handleReaction(message, "😭")} className="bg-none hover:bg-none focus:bg-none">
                    <FaFaceSadCry className="text-pink-300 text-3xl cursor-pointer hover:scale-[123%] duration-300" />
                </ContextMenuItem>

                <ContextMenuItem onClick={() => handleReaction(message, "😡")} className="bg-none hover:bg-none focus:bg-none">
                    <FaFaceAngry className="text-red-600 text-3xl cursor-pointer hover:scale-[123%] duration-300" />
                </ContextMenuItem>

            </div>
        </ContextMenuContent>
    </ContextMenu>
}

export default MessageCardMenu