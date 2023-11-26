"use client"
import { createContext, useContext, useEffect } from "react"
import io from "socket.io-client"
import type { Socket } from "socket.io-client"

const SocketContext = createContext<{ socket: Socket }>({ socket: io("https://socket-chat.luongson.me") })

function SocketProvider ({ children }:{ children: React.ReactNode }) {

    const socket = io("https://socket-chat.luongson.me")

    return <SocketContext.Provider value={{socket}}>
        { children }
    </SocketContext.Provider>
}

export const useSocket = () => useContext(SocketContext)

export default SocketProvider