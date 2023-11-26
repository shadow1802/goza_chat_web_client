"use client"
import { AuthState } from "@/types/auth"
import { getCookie } from "cookies-next"

const useAuthValue = () => {
    const authCookie = getCookie("auth")
    
    let authValue: AuthState | null
    
    if (authCookie) {
        authValue = JSON.parse(authCookie)
    } else { authValue = null }

    return authValue
}

export default useAuthValue