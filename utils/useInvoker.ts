"use client"
import { getCookie } from "cookies-next"

type Props = {
    baseUrl?: string
}

export default function useInvoker(options?: Props) {

    const base = options?.baseUrl ?? process.env.NEXT_PUBLIC_API

    const authCookie = getCookie("auth")

    const errorHandler = (res: any) => {

        if (res.status === 401) {
            console.log(`token must be provided:`, res)
            return res
        }

        if (res.status >= 200 && res.status <= 399) {
            console.log(`success request:`, res)
            return res
        }
    }

    let headers = {}

    if (authCookie) {
        headers = {
            Authorization: `Bearer ${JSON.parse(authCookie).token}`,
            'Content-Type': 'application/json'
        }
    } 

    const get = async (path: string) => {
        const req = await fetch(base + path, {
            method: "GET",
            headers
        }); const res = await req.json()
        errorHandler(res)
        return res
    }

    const post = async (path: string, data?: Object) => {
        const req = await fetch(base + path, {
            method: "POST",
            headers,
            body: JSON.stringify(data)
        }); const res = await req.json()
        errorHandler(res)
        return res
    }

    const remove = async (path: string) => {
        const req = await fetch(base + path, {
            method: "DELETE",
            headers
        }); const res = await req.json()
        errorHandler(res)
        return res
    }

    const put = async (path: string, data?: Object) => {
        console.log(`put payload:`, data)
        const req = await fetch(base + path, {
            method: "PUT",
            headers,
            body: JSON.stringify(data)
        }); const res = await req.json()
        errorHandler(res)
        return res
    }

    return { get, post, put, remove }
}