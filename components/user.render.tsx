import { IUser } from "@/types/user";

const UserRender = (props: { data: IUser[] }) => {
    return <>
        {
            props.data.map(item => <div key={item._id} className="group hover:bg-sky-500 rounded-lg p-2 user_room flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 border-2 rounded-full bg-sky-600"></div>
                    <div>
                        <p className="group-hover:text-white text-gray-700 text-sm">{item.fullName}</p>
                        <p className="group-hover:text-white text-xs text-gray-600 font-semibold">@username</p>
                    </div>
                </div>
                <div className="group-hover:flex hidden space-x-2 items-center">
                    <img className="cursor-pointer" src="/icons/call.svg" alt="" />
                    <img className="cursor-pointer" src="/icons/chat.svg" alt="" />
                    <img className="cursor-pointer" src="/icons/add-friend.svg" alt="" />
                </div>
            </div>)
        }
    </>
}

export default UserRender