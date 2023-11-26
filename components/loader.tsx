"use client"
import { useRouter } from "next/navigation"
import { FC, useEffect, useState, ReactNode } from "react"
import { getCookie } from "cookies-next"
import { AuthState } from "@/types/auth"

type Props = {
    onLoaded: ReactNode
    onErrorRedirectPath?: string
}

const Loader:FC<Props> = ({ onLoaded, onErrorRedirectPath }) => {

    const router = useRouter()
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const loader = async () => {
        try {
            /**
             * 1. kiem tra xem auth co ton tai hay khong: err => onSuccessRedirectPath
             * 2. load du lieu room da vao
             * 3. load danh sach cac admin
             */
            const authCookie = getCookie("auth")
            const authState = authCookie ? JSON.parse(authCookie) as AuthState : null

            if (!authState) throw Error("Auth khong ton tai") 

            setIsLoading(false)
        } catch (err) {
            console.log(err)
            router.push("/login")
        }
    }

    useEffect(() => {
        loader()
    }, [])

    return isLoading ? <div className="w-full min-h-screen bg-cover flex justify-center flex-col items-center">
        <img src="/images/luongson-logo-full.svg" alt="" className="w-[400px]" />
        <img src="/icons/loader.svg" alt="" className="w-20 h-20" />
    </div> : onLoaded
}; export default Loader