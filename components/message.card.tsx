import { IMessage } from "@/types/message"
import { dateTimeConverter } from "@/utils/dateTimeConverter"
import { FC, Dispatch, SetStateAction } from "react"
import Menu from "./menu"
import { useRoomContext } from "@/context/Room.context"
import { FaHeart, FaSadCry, FaAngry, FaSmile } from "react-icons/fa"
import log from "@/utils/logger"

type Props = {
    message: IMessage,
    setMessageEditor: Dispatch<SetStateAction<IMessage | null>>,
    setMessageReplySender: Dispatch<SetStateAction<IMessage | null>>,
    handleRemoveMessage: (id: string) => void
    prevMessage?: IMessage | null,
    handleReaction: (message: IMessage, emoji: string) => void
}

const MessageCard: FC<Props> = ({ message, setMessageEditor, handleRemoveMessage, setMessageReplySender, prevMessage, handleReaction }) => {

    const isSameUser = prevMessage?.createdBy._id === message.createdBy._id

    return <Menu list={[

        <div className="flex pl-4 space-x-4 justify-center">
            <button onClick={()=>handleReaction(message, "❤")} className="text-2xl"><FaHeart className="text-red-400"/></button>
            <button onClick={()=>handleReaction(message, "😭")} className="text-2xl"><FaSadCry className="text-yellow-400"/></button>
            <button onClick={()=>handleReaction(message, "😡")} className="text-2xl"><FaAngry className="text-red-700"/></button>
            <button onClick={()=>handleReaction(message, "😁")} className="text-2xl"><FaSmile className="text-yellow-400"/></button>
        </div>,

        <button className="w-[180px] flex items-center justify-between text-gray-200">
            <p className="text-sm font-semibold">Thêm biểu cảm</p>
            <img src="/icons/emoji.svg" className="w-6 h-6" alt="" />
        </button>,
        <button onClick={() => setMessageEditor(message)} className="w-[180px] flex items-center justify-between text-gray-200">
            <p className="text-sm font-semibold">Chỉnh sửa tin nhắn</p>
            <img src="/icons/pencil.svg" className="w-6 h-6" alt="" />
        </button>,
        <button className="w-[180px] flex items-center justify-between text-gray-200">
            <p className="text-sm font-semibold">Ghim tin nhắn</p>
            <img src="/icons/pin.svg" className="w-6 h-6" alt="" />
        </button>,
        <button onClick={() => setMessageReplySender(message)} className="w-[180px] flex items-center justify-between text-gray-200">
            <p className="text-sm font-semibold">Trả lời tin nhắn</p>
            <img src="/icons/reply.svg" className="w-6 h-6" alt="" />
        </button>,
        <button onClick={() => handleRemoveMessage(message._id)} className="w-[180px] flex items-center justify-between text-gray-200">
            <p className="text-sm font-semibold text-red-600">Xóa tin nhắn</p>
            <img src="/icons/remove.svg" className="w-6 h-6" alt="" />
        </button>
    ]}>
        <div className={`${!isSameUser && "mt-3"} flex space-x-2 max-w-[40rem]`}>
            {!isSameUser ? (
                message.createdBy.avatar ?
                    <img className="rounded-full w-10 h-10 flex justify-center items-center" src={message.createdBy.avatar} />
                    : <div className="bg-green-500 rounded-full w-10 h-10 flex justify-center items-center">
                        <p className="text-white">{message.createdBy.fullName[0]}</p>
                    </div>
            ) : <div className="w-10 h-4 flex justify-center items-center">
            </div>}

            <div className="message_content">
                {!isSameUser && (<p className="text-sm font-semibold text-black">{message.createdBy.fullName} <span className="ml-2 text-xs font-normal text-sky-600">{dateTimeConverter(String(message.lastModified))}</span></p>)}
                <p className="text-sm hover:bg-gray-200 text-gray-700">{message.message}</p>
                {message.file && <img src={message.file} className="border-2 max-w-[250px] max-h-[400px] rounded-lg"/>}
                {
                    message.reactions.length > 0 && <div>
                        { message.reactions.map((item: any, index) => <div key={index} className="w-9 h-5 text-xs border-[0.5px] flex justify-center items-center rounded-lg border-sky-500">
                            <p>{item.emoji}</p>
                            <p>1</p>
                        </div>) }
                    </div>
                }
            </div>

        </div>
    </Menu>
}

export default MessageCard