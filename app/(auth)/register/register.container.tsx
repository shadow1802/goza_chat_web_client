"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { CiLock, CiUser, CiReceipt, CiMail, CiPhone } from "react-icons/ci"
import type { FC, FormEvent } from "react"
import { Label } from "@/components/ui/label"
import Link from "next/link"

type Props = {}

const RegisterContainer: FC<Props> = (props) => {

    const { toast } = useToast()

    const onRegister = async (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault()
        const form = event.currentTarget
        const elements = form.elements as typeof form.elements & {
            username: { value: string },
            password: { value: string },
            fullName: { value: string },
            email: { value: string },
            phoneNumber: { value: string }
        }

        const { username, password, fullName, email, phoneNumber } = elements

        const register = await fetch(process.env.NEXT_PUBLIC_API + "/user/register", {
            method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
                username: username.value,
                password: password.value,
                fullName: fullName.value,
                ...(!!email.value && { email: email.value }),
                ...(!!phoneNumber.value && { phoneNumber: phoneNumber.value })
            })
        })

        const { message, data, status } = await register.json()

        if (status === 200) {
            toast({
                title: "Thành công",
                description: <p className='text-green-500 font-semibold'>{message}</p>,
            })
        } else {
            toast({
                title: "Thất bại",
                description: <p className='text-red-500 font-semibold'>{message}</p>,
            })
        }

        try {

        } catch (error: any) {

        }
    }

    return <div className="bg-gray-200 w-screen min-h-screen flex items-center justify-center">
        <div className="h-screen w-full flex flex-col justify-center items-center bg-sky-500">
            <form onSubmit={onRegister} className="">
                <Card className="rounded-none shadow-xl min-h-screen drop-shadow-xl bg-opacity-10 w-[500px]">
                    <CardHeader className="flex justify-center items-center">

                        <img src="/images/logo.png" className="w-44 h-44" alt="" />
                        <h1 className="text-sky-500 text-4xl font-bold">GOZA CHAT</h1>

                        <h2 className="text-xl font-semibold text-gray-600">Đăng ký tài khoản</h2>

                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <Label htmlFor="username" className="uppercase text-gray-600">Tên tài khoản *</Label>
                            <div className="flex items-center px-3 py-2 space-x-2 border-b-2">
                                <CiUser />
                                <input id="username" name="username" type="text" placeholder="Tên tài khoản phải lớn hơn 6 ký tự" className="text-sm w-full border-none outline-none" />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="password" className="uppercase text-gray-600">Mật khẩu *</Label>
                            <div className="flex items-center px-3 py-2 space-x-2 border-b-2">
                                <CiLock />
                                <input id="password" type="password" name="password" placeholder="Mật khẩu phải lớn hơn 6 ký tự" className="text-sm w-full border-none outline-none" />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="fullName" className="uppercase text-gray-600">Họ và tên *</Label>
                            <div className="flex items-center px-3 py-2 space-x-2 border-b-2">
                                <CiReceipt />
                                <input id="fullName" type="text" name="fullName" placeholder="Vui lòng nhập họ và tên của bạn" className="text-sm w-full border-none outline-none" />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="email" className="uppercase text-gray-600">Địa chỉ email</Label>
                            <div className="flex items-center px-3 py-2 space-x-2 border-b-2">
                                <CiMail />
                                <input id="email" type="text" name="email" placeholder="Vui lòng nhập địa chỉ email của bạn" className="text-sm w-full border-none outline-none" />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="phoneNumber" className="uppercase text-gray-600">Số điện thoại</Label>
                            <div className="flex items-center px-3 py-2 space-x-2 border-b-2">
                                <CiPhone />
                                <input id="phoneNumber" type="text" name="phoneNumber" placeholder="Vui lòng nhập số điện thoại của bạn" className="text-sm w-full border-none outline-none" />
                            </div>
                        </div>

                        <p className="text-end text-sm font-semibold">Đã có tài khoản? <Link href="/login" className="text-sky-500"> Đăng nhập ngay</Link></p>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full bg-sky-500">Hoàn tất</Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    </div>
}

export default RegisterContainer