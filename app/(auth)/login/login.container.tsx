"use client"

import { useRouter } from "next/navigation"
import Scanner from "@/components/form/scanner"
import Title from "@/components/title"
import { useToast } from "@/components/ui/use-toast"
import { setCookie } from "cookies-next"
import Link from "next/link"
import { useRef, useState, useEffect } from "react"
import { CiLock, CiUser } from "react-icons/ci"

type Props = { invition?: string }

export default function LoginContainer({ invition }: Props) {

    const { toast } = useToast()
    const [loading, setLoading] = useState<boolean>(false)
    const form = useRef<HTMLFormElement>(null)
    const router = useRouter()

    useEffect(() => {
        window.addEventListener("offline", () => {
            console.log("1. socket reconnect")
            console.log("2. socket relogin")
        })
    }, [])

    const onLogin = async (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault()
        const form = event.currentTarget
        const elements = form.elements as typeof form.elements & {
            username: { value: string },
            password: { value: string },
        }

        try {
            const { username, password } = elements
            console.log(username, password)
            const res = await fetch(process.env.NEXT_PUBLIC_API + "/user/login", {
                headers: { "Content-Type": "application/json" },
                method: "POST",
                body: JSON.stringify({ username: username.value, password: password.value })
            })

            const { status, data, message } = await res.json()

            if (status === 200) {
                setCookie("auth", JSON.stringify({
                    token: data.token, user: {
                        _id: data.user._id, username: data.user.username, role: data.user.role, bio: data.user.bio
                    }
                }))
                toast({
                    title: message,
                    duration: 2000,
                    description: <p className='text-green-500 font-semibold'>{message}</p>,
                })
                setLoading(true)

                if (invition) {
                    router.push(`/invition/${invition}`)
                } else router.push("/")
            } else {
                toast({
                    duration: 2000,
                    title: message,
                    description: <p className='text-red-500 font-semibold'>{message}</p>,
                })
            }
        } catch (error) {

        }
    }

    return <div>
        {loading && <div className="fixed top-[45%] left-[45%]">
            <img src="/icons/loading.svg" alt="" />
        </div>}
        <form ref={form} onSubmit={onLogin} className="bg-white border-t-2 w-[450px] shadow-sm shadow-white rounded-lg p-8 flex flex-col justify-center items-center">
            <div className='bg-gray-300 rounded-full drop-shadow-lg shadow-lg shadow-white'>
                <img src="/images/logo.png" className="w-44 h-44" alt="" />
            </div>

            <div className="flex mt-4 space-y-4 flex-col justify-center items-center">

                <Title size={26} />
                <h2 className="text-2xl font-semibold text-gray-600">Đăng nhập</h2>
                <p className='text-center text-gray-600 font-semibold'>Vui lòng nhập đúng tài khoản và mật khẩu của bạn để đăng nhập</p>

                <Scanner name='username' icon={<CiUser />} label="Tên tài khoản *" placeholder="Tên tài khoản phải lớn hơn 6 ký tự" />
                <Scanner name='password' type='password' icon={<CiLock />} placeholder="Mật khẩu phải lớn hơn 6 ký tự" label="Mật khẩu *" />

                <div className="flex justify-end">
                    <p className='text-gray-500 font-semibold text-sm'>Chưa có tài khoản? <Link className='text-sky-500' href={"/register"}>Đăng ký ngay</Link></p>
                </div>

                <button type="submit" className='text-white w-full hover:bg-sky-400 font-semibold duration-150 shadow-md shadow-white rounded-lg py-3 bg-sky-500'>Đăng Nhập</button>
            </div>
        </form>
    </div>
}