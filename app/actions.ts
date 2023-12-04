"use server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

type LoginConfigs = {
    redirectTo?: string
}

export async function login(form: FormData, configs?: LoginConfigs) {

    const username = form.get("username")
    const password = form.get("password")

    const res = await fetch(`${process.env.HOST}/user/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    })
    const { data, status, message } = await res.json()
    console.log(process.env.HOST)

    if (status === 200) {
        const { token, user } = data
        cookies().set("auth", JSON.stringify({ token, user: {
            _id: user._id, username: user.username, role: user.role, bio: user.bio
        } }))
        redirect(configs?.redirectTo ?? "/")
    } else throw new Error(message)

}

export async function createAnouncement(form: FormData) {
    const anouncement_content = form.get("anouncement_content")
    const anouncement_file = form.get("anouncement_file")

    console.log(anouncement_content, anouncement_file)
}