"use client"
import { CreatedBy, IRoom, LastMessage } from "@/types/room"
import { ICurrentUser, IUser } from "@/types/user"

import { ReactNode, Dispatch, SetStateAction, useState, createContext, useContext, useEffect } from "react"
import { useSocket } from "./Socket.context"
import { useAuthState } from "./Auth.context"
import guardian from "@/utils/guardian"
import { getCookie } from "cookies-next"
import { AuthState } from "@/types/auth"
import { INotify } from "@/types/notify"
import { IOutSide } from "@/types/outside"

const LobbyContext = createContext<{
    users: IUser[],
    rooms: IRoom[],
    currentUser: ICurrentUser | null,
    setCurrentUser: Dispatch<SetStateAction<ICurrentUser | null>>,
    setUsers: Dispatch<SetStateAction<IUser[]>>,
    setRooms: Dispatch<SetStateAction<IRoom[]>>,
    showChatScreen: boolean,
    setShowChatScreen: Dispatch<SetStateAction<boolean>>,
    notifies: INotify[],
    setNotifies: Dispatch<SetStateAction<INotify[]>>
}>({ 
    users: [], 
    rooms: [], 
    setUsers:() => [], 
    setRooms:() => [], 
    showChatScreen: false, 
    setShowChatScreen:() => false, 
    currentUser: null,
    setCurrentUser:() => [],
    notifies: [],
    setNotifies: () => []
})

type Props = { children: ReactNode, initialUsers: IUser[], initialRooms: IRoom[], initialCurrentUser: ICurrentUser | null, initialNotifies: INotify[] }

function LobbyProvider({ initialUsers, initialRooms, initialCurrentUser, initialNotifies, children }: Props) {

    const authCookie = getCookie("auth")
    const [users, setUsers] = useState<IUser[]>(initialUsers)
    const [rooms, setRooms] = useState<IRoom[]>(initialRooms)
    const [currentUser, setCurrentUser] = useState<ICurrentUser | null>(initialCurrentUser)
    const [notifies, setNotifies] = useState<INotify[]>(initialNotifies)
    const [showChatScreen, setShowChatScreen] = useState<boolean>(false)
    const { socket } = useSocket()

    useEffect(() => {

        if (authCookie) {
            const authState = JSON.parse(authCookie) as AuthState
            socket.emit("user_login", { userId: authState.user._id, token: authState.token })
        }

        socket.on("receive_notify", data => {
            console.log("receive_notify", data)
        })

        socket.on("receive_chat_room_outside", (data: IOutSide) => {

            const roomIndex = rooms.findIndex(room => room._id === data.room._id)

            setRooms(prev => {
                const newRooms = [...prev]
                newRooms[roomIndex].lastMessage = { 
                    _id: data._id, 
                    message: data.message, 
                    lastModified: data.lastModified, 
                    createdBy: data.createdBy as CreatedBy,
                    isDeleted: false
                }
                return newRooms
            })

            console.log("receive_chat_room_outside", data)
        })

        socket.on("login_time", data => console.log(data))

    }, [authCookie])

    return <LobbyContext.Provider value={{ users, rooms, setUsers, setRooms, showChatScreen, setShowChatScreen, currentUser, setCurrentUser, notifies, setNotifies }}>
        { children }
    </LobbyContext.Provider>
}

export const useLobbyContext = () => useContext(LobbyContext)

export default LobbyProvider