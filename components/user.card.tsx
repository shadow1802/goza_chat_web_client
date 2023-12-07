"use client"
import { IUser } from "@/types/user"
import { FC } from "react"
type Props = {
    user: { username: string, fullName: string, avatar: string }
    [key: string]: any
}

const UserCard: FC<Props> = ({ user, ...rest }) => {
    return <div {...rest} className="group cursor-pointer flex items-center space-x-2 hover:bg-sky-500 px-4 py-2">

        { user.avatar ? <img src={user.avatar} className="rounded-full w-10 h-10"/> : <img src="/images/default-avatar.jpg" className="border-2 rounded-full w-10 h-10"/> }

        <div>
            <p className="text-sky-500 group-hover:text-white text-[0.89rem] font-semibold">{user.fullName}</p>
            <p className="text-xs text-gray-500 group-hover:text-white font-semibold">@{user.username}</p>
        </div>
    </div>
}

export default UserCard