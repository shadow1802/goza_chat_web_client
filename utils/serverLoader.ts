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
            const req = await fetch(process.env.HOST + "/room/getByToken", this.configs)
            const { status, data, message } = await req.json()

            if (status === 200) {
                return data.filter((item: any) => item !== null)
            } else throw new Error(message)
    }

    async getNotifies() {
            const req = await fetch(process.env.HOST + "/notify/getListOfNotify", this.configs)
            const res = await req.json()
            return res.filter((item: any) => ['receive_message'].includes(item.type))
    }

    async getUsers() {
            const req = await fetch(process.env.HOST + "/user/getPaging", this.configs)
            // const { data, status, message } = await req.json()
            // if (status === 200) {
            //     return data
            // } else {
            //     console.log(this.configs, data, status, message)
            //     throw new Error(message)
            // }
            const res = await req.json()
            return res.data
    }

    async getCurrentUser() {
            const req = await fetch(process.env.HOST + "/user/getByToken", this.configs)
            const { status, data, message } = await req.json()
            if (status === 200) {
                return data
            } else throw new Error(message)
    }

    async getMessages(room: string) {
            const req = await fetch(process.env.HOST + `/chat/getPaging?room=${room}`, this.configs)
            const { status, data } = await req.json()
            if (status === 200) {
                return data
            } else return []
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

