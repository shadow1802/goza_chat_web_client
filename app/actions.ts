"use server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

type LoginConfigs = {
    redirectTo?: string
}

export async function login(form: FormData, configs?: LoginConfigs) {

    const username = form.get("username")
    const password = form.get("password")

    const body = JSON.stringify({ username, password })

    const res = await fetch("https://api-goza.luongson.me/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body
    })
    const { status, data, message } = await res.json()
    console.log(24, data)

    if (status === 200) {
        console.log(data.token)
        cookies().set("auth", JSON.stringify({ token: data.token, user: {
            _id: data.user._id, username: data.user.username, role: data.user.role, bio: data.user.bio
        } }))
        redirect(configs?.redirectTo ?? "/")
    } else throw new Error(message)

}

export async function createAnouncement(form: FormData) {
    const anouncement_content = form.get("anouncement_content")
    const anouncement_file = form.get("anouncement_file")

    console.log(anouncement_content, anouncement_file)
}