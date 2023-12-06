"use client"
import { getCookie, deleteCookie } from "cookies-next"
import { AuthState } from "@/types/auth"
import { ReactNode, useContext, createContext, useState, Dispatch, SetStateAction, useEffect, useRef, MutableRefObject } from "react"
import { useRouter } from "next/navigation"
type Props = { children: ReactNode }

const AuthContext = createContext<{
    authState: AuthState | null,
    setAuthState: Dispatch<SetStateAction<AuthState | null>>,
    logOut: () => void,
}>(
    {
        authState: null,
        setAuthState: () => null,
        logOut: () => null,
    })

export default function AuthProvider({ children }: Props) {

    const router = useRouter()
    const authCookie = getCookie("auth")
    const [authState, setAuthState] = useState<AuthState | null>(null)

    const loadAuthState = async () => {
        const authCookie = getCookie("auth")
        if (authCookie) {
            const authCookieParsed = JSON.parse(authCookie) as AuthState
            setAuthState(authCookieParsed)
        } else {
            console.log("logout")
        }
    }

    useEffect(() => {
        loadAuthState()
    }, [authCookie])

    const logOut = () => {
        deleteCookie("auth")
        setAuthState(null)
        router.push("/login")
    }

    return <AuthContext.Provider value={{ authState, setAuthState, logOut }}>
        {children}
    </AuthContext.Provider>
}

export const useAuthState = () => useContext(AuthContext)
