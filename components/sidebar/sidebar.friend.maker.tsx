import {
    DialogContent, DialogClose
} from "@/components/ui/dialog"
import Scanner from "../form/scanner"
import { FaBullseye } from "react-icons/fa6"
import useInvoker from "@/utils/useInvoker"
import { useToast } from "../ui/use-toast"
import { useLobbyContext } from "@/context/Lobby.context"
import { useSocket } from "@/context/Socket.context"

const FriendMaker = () => {

    const invoker = useInvoker()
    const { reloader } = useLobbyContext()
    const { toast } = useToast()
    const { socket } = useSocket()

    const onMakeFriend = async (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault()
        const form = event.currentTarget
        const elements = form.elements as typeof form.elements & {
            goza: { value: string },
        }

        if (elements.goza.value.length < 6) {
            toast({ duration: 2000, title: "Mã goza phải bao gồm 6 ký tự" })
            return
        }

        const { data, status, message } = await invoker.post("/friend/addFriend", {
            goza: elements.goza.value
        })

        if (status === 200) {
            await reloader.currentUser()
            toast({ duration: 2000, title: "Thêm bạn bè thành công" })
            socket.emit("add_friend", { fromUserObject: data.from, toUserObject: data.to })
        } else {
            toast({ duration: 2000, title: message })
        }
    }

    return <DialogContent className="w-[600px] p-0 border-none outline-none rounded-none">
        <div className="bg-sky-500 px-4 py-3">
            <h1 className="text-white font-semibold">Thêm bạn bè</h1>
        </div>
        <form onSubmit={onMakeFriend} className="px-4 pb-4">
            <p className="text-lg font-semibold">Nhập mã GOZA của đối tác để kết bạn</p>
            <Scanner icon={<FaBullseye />} name="goza" placeholder="Mã GOZA của đối tác" />
            <DialogClose asChild>
                <button type="submit" className="mt-2 w-full py-2 bg-sky-500 text-white font-semibold">Kết bạn</button>
            </DialogClose>
        </form>
    </DialogContent>
}

export default FriendMaker