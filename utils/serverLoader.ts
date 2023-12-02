import { AuthState } from '@/types/auth'
import { cookies } from 'next/headers'
import log from './logger'

export default class ServerLoader {

    configs: RequestInit = {
        headers: {
            Authorization: ""
        }
    }

    constructor() {

        const cookieStore = cookies()
        const authCookie = cookieStore.get('auth')
        const authState = authCookie ? JSON.parse(authCookie.value) as AuthState : null

        if (authState) {

            this.configs = {
                headers: {
                    Authorization: `Bearer ${authState?.token}`
                }
            }
        } else {
            throw new Error("Token is not valid")
        }
    }

    async getJoinedRooms() {
        try {
            const req = await fetch(process.env.HOST + "/room/getByToken", this.configs)
            const { status, data } = await req.json()

            if (status === 200) {
                return data.filter((item: any) => item !== null)
            } else {
                return []
            }
        } catch (error: any) {
            log.error(["getJoinedRooms", error])
            return []
        }
    }

    async getNotifies() {
        try {
            const req = await fetch(process.env.HOST + "/notify/getListOfNotify", this.configs)

            const res = await req.json()
            console.log(res)
            return res.filter((item: any) => ['receive_message'].includes(item.type))
        } catch (error: any) {
            log.error(["getNotifies", error.message])
            return []
        }
    }

    async getUsers() {
        try {
            const req = await fetch(process.env.HOST + "/user/getPaging", this.configs)
            const { data } = await req.json()
            return data ?? []
        } catch (error: any) {
            log.error(["getUsers", error])
            return []
        }
    }

    async getCurrentUser() {
        try {
            const req = await fetch(process.env.HOST + "/user/getByToken", this.configs)
            const { status, data } = await req.json()
            if (status === 200) {
                return data
            } else return null
        } catch (error: any) {
            log.error(["getCurrentUser", error])
            return null
        }
    }

    async getMessages(room: string) {
        try {
            const req = await fetch(process.env.HOST + `/chat/getPaging?room=${room}`, this.configs)
            const { status, data } = await req.json()
            if (status === 200) {
                return data
            } else return []
        } catch (error: any) {
            log.error(["getMessages", error])
            return []
        }
    }

    async getRoomDetailById(room: string) {
        const req = await fetch(process.env.HOST + `/room/getRoomById/${room}`, this.configs)
        const { status, data } = await req.json()
        if (status === 200) {
            return data
        } else return {}
    }

    async getAnouncement(room: string) {
        try {
            const req = await fetch(process.env.HOST + `/room/notify/paging?roomId=${room}`, this.configs)
            const { status, data } = await req.json()
            if (status === 200) {
                return data.data
            } else return []
        } catch (error: any) {
            log.error(["getAnouncement", error])
            return []
        }
    }
}

