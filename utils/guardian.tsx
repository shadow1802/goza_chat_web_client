"use client"
import { useAuthState } from "@/context/Auth.context";
import { useSocket } from "@/context/Socket.context";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react"

type Props = {
    children: React.ReactNode;
};

const guardian: CallableFunction = (ProtectedComponent: React.FC) => {

    const Component: React.FC<Props> = () => {

        const authCookie = getCookie("auth")
        const router = useRouter()
        const { authState } = useAuthState()
        const { socket } = useSocket()
        const [isAuth, setIsAuth] = useState<boolean>(false)

        useEffect(() => {

            if (authCookie) {
                console.log("render page")
                setIsAuth(true)
            }

        }, [authCookie])

        return isAuth ? <ProtectedComponent />:null
    };


    return Component;
};

export default guardian;