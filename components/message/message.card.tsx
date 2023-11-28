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

type Props = {
    message: IMessage,
    setMessageEditor: Dispatch<SetStateAction<IMessage | null>>,
    setMessageReplySender: Dispatch<SetStateAction<IMessage | null>>,
    handleRemoveMessage: (id: string) => void
    prevMessage?: IMessage | null,
    handleReaction: (message: IMessage, emoji: string) => void
}

const MessageCard: FC<Props> = ({ message, setMessageEditor, handleRemoveMessage, setMessageReplySender, prevMessage, handleReaction }) => {

    const { roomDetail } = useRoomContext()
    const memberDetail = roomDetail?.roomUsers.find(item => item.user._id === message.createdBy._id)
    const isSameUser = prevMessage?.createdBy._id === message.createdBy._id

    return <MessageCardMenu message={message} setMessageEditor={setMessageEditor} handleRemoveMessage={handleRemoveMessage} setMessageReplySender={setMessageReplySender} handleReaction={handleReaction}>
        <div onClick={() => console.log(message)} className={`${!isSameUser && "mt-3"} flex space-x-2 max-w-[40rem]`}>
            {!isSameUser ? (
                message.createdBy.avatar ?
                    <img className="rounded-full w-10 h-10 flex justify-center items-center" src={message.createdBy.avatar} />
                    : <div className="bg-green-500 rounded-full w-10 h-10 flex justify-center items-center">
                        <p className="text-white">{message.createdBy.fullName[0]}</p>
                    </div>
            ) : <div className="w-10 h-4 flex justify-center items-center">
            </div>}

            <div className={`message-content ${message.replyTo && "p-4 rounded-lg border-2 mt-3 shadow-md max-w-[24rem]"}`}>

                {!isSameUser && (<p className={`max-w-[22rem] text-sm font-semibold ${memberDetail && ROOM_ROLES_COLORS[memberDetail?.roomRole]}`}>{message.createdBy.fullName} <span className="ml-2 text-xs font-normal text-sky-600">{dateTimeConverter(String(message.lastModified))}</span></p>)}
                <p className="min-w-[100px] group text-sm hover:scale-[115%] hover:bg-white hover:bg-opacity-50 rounded-md hover:shadow-md
                duration-200 hover:px-2 text-gray-700">{message.message} <span className="text-[0.7rem] text-sky-600 hidden group-hover:inline">{dateTimeConverter(String(message.lastModified))}</span></p>

                {message.replyTo && <div className="mt-1 border-l-8 border-sky-500 px-2 text-gray-600 flex space-x-2 items-center">
                    <IoReturnDownForwardSharp className="text-2xl text-sky-500" />
                    <div>
                        <div className="bg-gray-200 px-2 py-1 rounded-lg flex items-center space-x-2">
                            <img src="/images/default-avatar.jpg" className="w-9 h-9 rounded-full border-2 border-sky-500" alt="" />
                            <div>
                                <p className="text-sm font-semibold text-gray-500">
                                    <span className="text-sky-500">{message.createdBy.fullName}</span> đã trả lời tin nhắn của <span className="text-sky-500">{message.replyTo.createdBy.fullName}</span></p>
                                <p className="text-xs">{message.replyTo.message}</p>

                            </div>
                        </div>
                        {message?.replyTo?.file && <img src={message.replyTo.file} className="mt-2 w-full" />}
                    </div>
                </div>}


                {message.file && <img src={message.file} className="hover:scale-[115%] duration-200 shadow-lg max-w-[250px] max-h-[400px] rounded-lg" />}
                {
                    message.reactions.length > 0 && <div>
                        {message.reactions.map((item: any, index) => <div key={index} className="w-9 h-5 text-xs border-[0.5px] flex justify-center items-center rounded-lg border-sky-500">
                            <p>{item.emoji}</p>
                            <p className="text-sky-600">1</p>
                        </div>)}
                    </div>
                }
            </div>

        </div>
    </MessageCardMenu>
}

export default MessageCard