"use client"

import { login } from "@/app/actions"
import Scanner from "@/components/form/scanner"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { CiLock, CiUser } from "react-icons/ci"

export default function Container() {

    const { toast } = useToast()

    return <div>
        <form action={async (data: FormData) => {
            try {
                await login(data)
            } catch (error) { toast({ title: "tuoi lol ban oi" }) }
        }} className="bg-white border-t-2 w-[450px] shadow-sm shadow-white rounded-lg p-8 flex flex-col justify-center items-center">
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
    </div>
}