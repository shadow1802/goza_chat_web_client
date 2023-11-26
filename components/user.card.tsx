"use client"
import { IUser } from "@/types/user"
import { FC } from "react"
type Props = {
    user: IUser
    [key: string]: any
}

const UserCard: FC<Props> = ({ user, ...rest }) => {
    return <div {...rest} className="flex items-center space-x-2">

        <div className="flex items-center justify-center w-10 h-10 p-3 rounded-full bg-sky-500">
            <p className="text-gray-100">{user.username[0]}</p>
        </div>

        <div>
            <p className="text-gray-600 text-[0.89rem] font-semibold">{user.fullName}</p>
            <p className="text-sm text-gray-500">@{user.username}</p>
        </div>
    </div>
}

export default UserCard