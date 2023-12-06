"use client"
import { CreatedBy, IRoom } from "@/types/room"
import { ICurrentUser, IUser } from "@/types/user"
import { useToast } from "@/components/ui/use-toast"
import { ReactNode, Dispatch, SetStateAction, useState, createContext, useContext, useEffect } from "react"
import { useSocket } from "./Socket.context"
import { getCookie } from "cookies-next"
import { AuthState } from "@/types/auth"
import { INotify } from "@/types/notify"
import { IOutSide } from "@/types/outside"
import { dateTimeConverter } from "@/utils/dateTimeConverter"
import useInvoker from "@/utils/useInvoker"

const LobbyContext = createContext<{
    users: IUser[],
    rooms: IRoom[],
    currentUser: ICurrentUser | null,
    setCurrentUser: Dispatch<SetStateAction<ICurrentUser | null>>,
    setUsers: Dispatch<SetStateAction<IUser[]>>,
    setRooms: Dispatch<SetStateAction<IRoom[]>>,
    showChatScreen: boolean,
    setLoading: Dispatch<SetStateAction<boolean>>,
    setShowChatScreen: Dispatch<SetStateAction<boolean>>,
    notifies: INotify[],
    setNotifies: Dispatch<SetStateAction<INotify[]>>
}>({
    users: [],
    rooms: [],
    setLoading: () => null,
    setUsers: () => [],
    setRooms: () => [],
    showChatScreen: false,
    setShowChatScreen: () => false,
    currentUser: null,
    setCurrentUser: () => [],
    notifies: [],
    setNotifies: () => []
})

type Props = { children: ReactNode, initialUsers: IUser[], initialRooms: IRoom[], initialCurrentUser: ICurrentUser | null, initialNotifies: INotify[] }

function LobbyProvider({ initialUsers, initialRooms, initialCurrentUser, initialNotifies, children }: Props) {

    const authCookie = getCookie("auth")
    const invoker = useInvoker()
    const [loading, setLoading] = useState<boolean>(false)
    const [users, setUsers] = useState<IUser[]>(initialUsers)
    const [rooms, setRooms] = useState<IRoom[]>(initialRooms)
    const [currentUser, setCurrentUser] = useState<ICurrentUser | null>(initialCurrentUser)
    const [notifies, setNotifies] = useState<INotify[]>(initialNotifies)
    const { toast } = useToast()
    const [showChatScreen, setShowChatScreen] = useState<boolean>(false)
    const { socket } = useSocket()

    const reloader = {
        setRooms: async () => {
            const { data, status } = await invoker.get("/room/getByToken")
            setRooms(data.filter((item: any) => item !== null))
        },
        setUsers: async () => {},
        currentUser: async () => {}
    }

    useEffect(() => {

        if (authCookie) {
            const authState = JSON.parse(authCookie) as AuthState
            socket.emit("user_login", { userId: authState.user._id, token: authState.token })
        }

        socket.on("receive_notify", data => {
            console.log("receive_notify", data)
        })

        socket.on("receive_chat_room_outside", (data: IOutSide) => {
            try {
                const { _id, message, lastModified, createdBy } = data
                if (!_id && !message && !lastModified && !createdBy) return
                if (data?.self) return

                const roomIndex = rooms.findIndex(room => room._id === data.room._id)

                setRooms(prev => {
                    const newRooms = [...prev]
                    newRooms[roomIndex].lastMessage = {
                        _id: _id,
                        message: message,
                        lastModified: lastModified,
                        createdBy: createdBy as CreatedBy,
                        isDeleted: false
                    }
                    return newRooms
                })

                toast({
                    title: `Tin nhắn mới`,
                    description: <div className="flex items-center space-x-3">
                        {data.createdBy.avatar ? <img src={data.createdBy.avatar} className="border-2 border-sky-500 w-12 h-12 rounded-full" />
                            : <img src="images/default-avatar.jpg" className="border-2 border-sky-500 w-12 h-12 rounded-full" />}
                        <div>
                            <p className="text-xs text-black">{data.room.roomName}</p>
                            <p className="text-sm font-semibold text-sky-500">{data.createdBy.fullName}  <span className="text-xs text-gray-500">{dateTimeConverter(String(data.createdTime))}</span></p>
                            <p className="text-xs">{data.message}</p>
                        </div>
                    </div>
                })
            } catch (error: any) {
                toast({ title: error.message })
            }
        })

        socket.on("receive_invite_into_room", (data) => {

            toast({
                title: `${data.from ? data.from.fullName + ' đã mời bạn vào phòng' : 'Ai đó đã mời bạn vào phòng'}`,
                description: <div className="flex space-x-2 items-center">
                    {data.roomObject.roomIcon && <img src={data.roomObject.roomIcon} className="w-10 h-10 border-2 border-sky-500 rounded-full" />}
                    <div className="">
                        <p className="text-sky-500 font-semibold text-lg">{data.roomObject.roomName}</p>
                        <p className="text-sm font-semibold text-gray-600">{data.roomObject.roomUsers.length} thành viên</p>
                    </div>
                </div>
            })
            setRooms(prev => [...prev, data.roomObject])
        })

        socket.on("login_time", data => console.log(data))

    }, [authCookie])

    return <LobbyContext.Provider value={{ users, rooms, setLoading, setUsers, setRooms, showChatScreen, setShowChatScreen, currentUser, setCurrentUser, notifies, setNotifies }}>
        {children}
        {loading && <div className="fixed z-30 top-[45%] left-[45%]">
            <img src="/icons/loading.svg" alt="" />
        </div>}
    </LobbyContext.Provider>
}

export const useLobbyContext = () => useContext(LobbyContext)

export default LobbyProvider