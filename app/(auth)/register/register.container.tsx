"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { CiLock, CiUser, CiReceipt, CiMail, CiPhone } from "react-icons/ci"
import { useState, type FC, type FormEvent } from "react"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Title from "@/components/title"

type Props = {}

const RegisterContainer: FC<Props> = (props) => {

    const { toast } = useToast()
    const [loading, setLoading] = useState<boolean>(false)

    const onRegister = async (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true)
        const form = event.currentTarget
        const elements = form.elements as typeof form.elements & {
            username: { value: string },
            password: { value: string },
            fullName: { value: string },
            email: { value: string },
            repeat_password: { value: string },
            phoneNumber: { value: string }
        }

        try {

            const { username, password, fullName, email, phoneNumber, repeat_password } = elements

            if (repeat_password.value !== password.value) {
                throw new Error("Mật khẩu xác thực không trùng khớp, vui lòng thử lại")
            }

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
            setLoading(false)
            if (status === 200) {
                toast({
                    title: "Thành công",
                    duration: 2000,
                    description: <p className='text-green-500 font-semibold'>{message}</p>,
                })
            } else {
                toast({
                    title: "Thất bại",
                    duration: 2000,
                    description: <p className='text-red-500 font-semibold'>{message}</p>,
                })
            }



        } catch (error: any) {
            toast({
                title: "Thất bại",
                duration: 2000,
                description: <p className='text-red-500 font-semibold'>{error.message}</p>,
            })
            setLoading(false)
        }
    }

    return <div className="bg-gray-200 w-screen min-h-screen flex items-center justify-center">
        <div className="h-screen w-full flex flex-col justify-center items-center bg-sky-500">
            {loading && <div className="fixed z-30 top-[45%] left-[45%]">
                <img src="/icons/loading.svg" alt="" />
            </div>}
            <form onSubmit={onRegister} className="">
                <Card className="rounded-none shadow-xl min-h-screen drop-shadow-xl bg-opacity-10 w-[500px]">
                    <CardHeader className="flex justify-center items-center">

                        <img src="/images/logo.png" className="w-44 h-44" alt="" />

                        <Title size={26} />

                        <h2 className="text-2xl font-semibold text-gray-600">Đăng ký tài khoản</h2>

                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <Label htmlFor="username" className="uppercase text-gray-600">Tên tài khoản <span className="text-red-500">*</span></Label>
                            <div className="flex items-center px-3 py-2 space-x-2 border-b-2">
                                <CiUser />
                                <input id="username" name="username" type="text" placeholder="Tên tài khoản phải lớn hơn 6 ký tự" className="text-sm w-full border-none outline-none" />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="password" className="uppercase text-gray-600">Mật khẩu <span className="text-red-500">*</span></Label>
                            <div className="flex items-center px-3 py-2 space-x-2 border-b-2">
                                <CiLock />
                                <input id="password" type="password" name="password" placeholder="Mật khẩu phải lớn hơn 6 ký tự" className="text-sm w-full border-none outline-none" />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="repeat_password" className="uppercase text-gray-600">Xác nhận mật khẩu <span className="text-red-500">*</span></Label>
                            <div className="flex items-center px-3 py-2 space-x-2 border-b-2">
                                <CiLock />
                                <input id="repeat_password" type="password" name="repeat_password" placeholder="Phải trùng khớp với mật khẩu bạn đã nhập" className="text-sm w-full border-none outline-none" />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="fullName" className="uppercase text-gray-600">Họ và tên <span className="text-red-500">*</span></Label>
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