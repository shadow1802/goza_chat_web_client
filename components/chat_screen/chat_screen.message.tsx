import { IMessage } from "@/types/message"
import { dateTimeConverter } from "@/utils/dateTimeConverter"
import useAuthValue from "@/utils/useAuthValue"
import { FC } from "react"

type Props = {
    message: IMessage
}

const ChatScreenMessageCard: FC<Props> = ({ message }) => {

    const authValue = useAuthValue()

    const isSameCreator = authValue?.user._id === message.createdBy._id

    return <div className={`group hover:bg-gray-100 px-5 py-2 w-[100%] flex ${isSameCreator ? "justify-end" : "justify-start"} items-center space-x-4`}>
        { isSameCreator && <p className="hidden group-hover:flex text-xs font-semibold text-gray-400">{dateTimeConverter(String(message.lastModified))}</p> }
        <div>
            {message.file && <img src={message.file} className="rounded-t-lg max-w-[280px]" />}
            <p className={`border-2 text-sm ${message.file ? 'rounded-b-lg':'rounded-lg'} px-2 py-1  ${isSameCreator ? "bg-sky-500 text-gray-100":"bg-white"}`}>{message.message}</p>
        </div>
        { !isSameCreator && <p className="hidden group-hover:flex text-xs font-semibold text-gray-400">{dateTimeConverter(String(message.lastModified))}</p> }
    </div>
}

export default ChatScreenMessageCard