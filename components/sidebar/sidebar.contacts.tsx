import { FC, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import UserCard from "../user.card"
import { IUser } from "@/types/user"
import useInvoker from "@/utils/useInvoker"
import { useLobbyContext } from "@/context/Lobby.context"
import { ROLES } from "@/constants/user.roles"

type Props = { open: boolean, onOpenChange: (open: boolean) => void, handlerClickUser: (userId: string) => Promise<void> }

const Contacts: FC<Props> = ({ open, onOpenChange, handlerClickUser }) => {

    const invoker = useInvoker()
    const [searchUserItems, setSearchUsersItems] = useState<IUser[]>([])
    const { users, currentUser } = useLobbyContext()

    const onClickUser = (userId: string) => {
        onOpenChange(false)
        handlerClickUser(userId)
    }

    const handleSearchUser = async (input: string) => {
        const { data } = await invoker.get(`/user/getPaging?fullName=${input}`)
        setSearchUsersItems(data)
    }

    return <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[525px] p-0 rounded-none border-none">
            <DialogHeader className="mb-0 bg-sky-500 px-4 text-white py-3">
                <DialogTitle className="text-white">Danh bạ</DialogTitle>
                <DialogDescription className="text-gray-200">
                    Tìm và nhắn tin đến người mà bạn muốn
                </DialogDescription>
            </DialogHeader>

            <div className="mt-0 px-4">
                <div className="bg-gray-100 flex space-x-1 py-2 border-2 px-2">
                    <img src="/icons/search.svg" className="w-5 h-5" alt="" />
                    <input type="text" onChange={(e) => handleSearchUser(e.target.value)} className="bg-gray-100 w-full text-sm" placeholder="Tìm kiếm người dùng" />
                </div>
            </div>

            <div className="relative border-b-2">
                <p className="px-4 mb-1 text-gray-600 font-semibold">{currentUser?.role.roleName === ROLES.SUPERADMIN ? "Thành viên" : "Tổng đài"}</p>
                {searchUserItems.length > 0 ?
                    searchUserItems?.map(item => <UserCard key={item._id} user={item} handlerClickUser={handlerClickUser} />)
                    : users?.map(item => <UserCard key={item._id} user={item} handlerClickUser={handlerClickUser}  />)
                }
            </div>
            {currentUser?.role.roleName === ROLES.USER && <div className="friends">
                <p className="px-4 mb-1 text-gray-600 font-semibold">Bạn bè:</p>
                {currentUser?.friends && currentUser?.friends.map(item => {
                    return <UserCard key={item._id} user={item} handlerClickUser={handlerClickUser} isFriend />
                })}
            </div>}

            <DialogFooter>

            </DialogFooter>
        </DialogContent>
    </Dialog>
}

export default Contacts