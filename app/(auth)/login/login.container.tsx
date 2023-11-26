"use client"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FC, useRef, SyntheticEvent } from "react"
import { useToast } from "@/components/ui/use-toast"
import { setCookie } from 'cookies-next'
import { useAuthState } from '@/context/Auth.context'
import Scanner from '@/components/form/scanner'
import { FaUser } from 'react-icons/fa'
import { CiLock, CiUser } from 'react-icons/ci'

type Props = { invite?: string }

const LoginContainer: FC<Props> = ({ invite }) => {

    const { toast } = useToast()
    const { setAuthState } = useAuthState()
    const router = useRouter()

    const handleLogin = async (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault()
        try {
            const form = event.currentTarget
            const elements = form.elements as typeof form.elements & {
                username: { value: string },
                password: { value: string },
            }

            const { username, password } = elements

            const res = await fetch(`https://api-chat.luongson.me/api/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username.value, password: password.value
                })
            })

            const { status, data, message } = await res.json()

            if (status === 200) {
                setCookie("auth", data)
                setAuthState(data)
                console.log(data)
                if (invite) {
                    router.push(`/invite/${invite}`)
                } else { router.push("/") }
            } else {
                toast({
                    title: "Đã xảy ra lỗi",
                    description: <p className='text-red-500 font-semibold'>{message}</p>,
                })
            }

        } catch (error) {

        }
    }

    return <form onSubmit={handleLogin} className="bg-white border-t-2 w-[450px] shadow-sm shadow-white rounded-lg p-8 flex flex-col justify-center items-center">
        <div className='bg-gray-300 rounded-full drop-shadow-lg shadow-lg shadow-white'>
            <img src="/images/logo.png" className="w-36 h-36" alt="" />
        </div>

        <div className="flex space-y-4 flex-col justify-center items-center">

            <h2 className='mt-6 text-2xl font-bold text-sky-500'>Đăng Nhập</h2>
            <p className='text-center text-gray-600 font-semibold'>Vui lòng nhập đúng tài khoản và mật khẩu của bạn để đăng nhập</p>

            <Scanner name='username' icon={<CiUser />} label="Tên tài khoản *" placeholder="Tên tài khoản phải lớn hơn 6 ký tự" />
            <Scanner name='password' type='password' icon={<CiLock />} placeholder="Mật khẩu phải lớn hơn 6 ký tự" label="Mật khẩu *" />

            <div className="flex justify-end">
                <p className='text-gray-500 font-semibold text-sm'>Chưa có tài khoản? <Link className='text-sky-500' href={"/register"}>Đăng ký ngay</Link></p>
            </div>

            <button className='text-white w-full hover:bg-sky-400 font-semibold duration-150 shadow-md shadow-white rounded-lg py-3 bg-sky-500'>Đăng Nhập</button>
        </div>

    </form>
}

export default LoginContainer