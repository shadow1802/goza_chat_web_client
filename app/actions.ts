"use server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function login(form: FormData) {

    const username = form.get("username")
    const password = form.get("password")

    const res = await fetch(`https://api-chat.luongson.me/api/user/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    })
    const { data, status, message } = await res.json()

    if (status === 200) {
        const { token, user } = data
        cookies().set("auth", JSON.stringify({ token, user: {
            _id: user._id, username: user.username, role: user.role, bio: user.bio
        } }))
        redirect("/")
    } else throw new Error(message)

}