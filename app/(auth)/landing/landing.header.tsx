"use client"
import Link from "next/link"
import { FC } from "react"

const Header:FC = () => {
    return <div className="w-full flex space-x-1 justify-center pt-8">
        <Link href={"/"} className="bg-white rounded-2xl text-sky-500 font-semibold px-4 py-1">Mở ứng dụng</Link>
        <Link href={"/landing"} className="rounded-2xl text-white font-semibold px-4 py-1">Về chúng tôi</Link>
        <Link href={"/login"} className="rounded-2xl text-white font-semibold px-4 py-1">Đăng nhập</Link>
        <Link href={"/register"} className="rounded-2xl text-white font-semibold px-4 py-1">Đăng ký</Link>
    </div>
}

export default Header