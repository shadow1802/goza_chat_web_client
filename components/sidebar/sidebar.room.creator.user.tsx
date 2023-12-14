import { IUser } from "@/types/user"
import { FC, Dispatch, SetStateAction } from "react"

type Props = { 
    data: IUser, usersSelected: { _id: string, fullName: string }[], 
    setUsersSelected: Dispatch<SetStateAction<{ _id: string, fullName: string }[]>>
}

const User: FC<Props> = ({ data, usersSelected, setUsersSelected }) => {

    const existed = usersSelected.find(u => u._id === data._id)

    const onClick = () => {
        if (!existed) {
            setUsersSelected(prev => [...prev, { _id: data._id, fullName: data.fullName }])
        } else { setUsersSelected(prev => {
            const filtered = prev.filter(item => item._id !== data._id)
            return filtered
        }) }
    }

    return <div onClick={onClick} className={`cursor-pointer ${existed && "bg-sky-500"} hover:bg-sky-400 flex items-center space-x-2 p-3 border-gray-300 border-b-2`}>
        <img src={data.avatar || "/images/default-avatar.jpg"} className="w-10 h-10 bg-sky-500 rounded-full"/>
        <div>
            <p className="leading-3 text-black text-sm font-semibold">{ data.fullName }</p>
            <small className="leading-3 text-gray-700">@{ data.username }</small>
        </div>
    </div>
}

export default User