"use client"

import { login } from "@/app/actions"
import Scanner from "@/components/form/scanner"
import Title from "@/components/title"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { useRef, useState, useEffect } from "react"
import { CiLock, CiUser } from "react-icons/ci"

type Props = { invite?: string }

export default function LoginContainer({ invite }: Props) {

    const { toast } = useToast()
    const [loading, setLoading] = useState<boolean>(false)
    const form = useRef<HTMLFormElement>(null)

    useEffect(() => {
        window.addEventListener("offline", () => {
            console.log("1. socket reconnect")
            console.log("2. socket relogin")
        })
    }, [])

    const onError = (text: string) => {
        toast({ title: "Không thể đăng nhập", description: <p className="text-red-500">{text}</p> })
    }

    const checker = () => {
        setLoading(true)
    }

    return <div>
        { loading && <div className="fixed top-[45%] left-[45%]">
            <img src="/icons/loading.svg" alt="" />
        </div> }
        <form ref={form} action={async (data: FormData) => {
            try {
                setLoading(false)
                await login(data, { ...(!!invite && { redirectTo: `/invite/${invite}` }) })
            } catch (error: any) { onError(error.message)  }
        }} className="bg-white border-t-2 w-[450px] shadow-sm shadow-white rounded-lg p-8 flex flex-col justify-center items-center">
            <div className='bg-gray-300 rounded-full drop-shadow-lg shadow-lg shadow-white'>
                <img src="/images/logo.png" className="w-44 h-44" alt="" />
            </div>

            <div className="flex mt-4 space-y-4 flex-col justify-center items-center">

                <Title size={26}/>
                <h2 className="text-2xl font-semibold text-gray-600">Đăng nhập</h2>
                <p className='text-center text-gray-600 font-semibold'>Vui lòng nhập đúng tài khoản và mật khẩu của bạn để đăng nhập</p>

                <Scanner name='username' icon={<CiUser />} label="Tên tài khoản *" placeholder="Tên tài khoản phải lớn hơn 6 ký tự" />
                <Scanner name='password' type='password' icon={<CiLock />} placeholder="Mật khẩu phải lớn hơn 6 ký tự" label="Mật khẩu *" />

                <div className="flex justify-end">
                    <p className='text-gray-500 font-semibold text-sm'>Chưa có tài khoản? <Link className='text-sky-500' href={"/register"}>Đăng ký ngay</Link></p>
                </div>

                <button type="submit" onClick={checker} className='text-white w-full hover:bg-sky-400 font-semibold duration-150 shadow-md shadow-white rounded-lg py-3 bg-sky-500'>Đăng Nhập</button>
            </div>
        </form>
    </div>
}