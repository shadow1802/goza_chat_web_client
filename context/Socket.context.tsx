"use client"
import { createContext, useContext, useEffect } from "react"
import io from "socket.io-client"
import type { Socket } from "socket.io-client"

const SocketContext = createContext<{ socket: Socket }>({ socket: io(process.env.NEXT_PUBLIC_SOCKET as string) })

function SocketProvider ({ children }:{ children: React.ReactNode }) {

    const socket = io(process.env.NEXT_PUBLIC_SOCKET as string)

    return <SocketContext.Provider value={{socket}}>
        { children }
    </SocketContext.Provider>
}

export const useSocket = () => useContext(SocketContext)

export default SocketProvider