"use client"

import { useRouter } from "next/navigation"
import Scanner from "@/components/form/scanner"
import Title from "@/components/title"
import { useToast } from "@/components/ui/use-toast"
import { setCookie } from "cookies-next"
import Link from "next/link"
import { useRef, useState, useEffect } from "react"
import { CiLock, CiUser } from "react-icons/ci"
import { FcGoogle } from "react-icons/fc"
import { FaFacebook } from "react-icons/fa6"
import { GoogleAuthProvider, signInWithPopup, FacebookAuthProvider } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useSocket } from "@/context/Socket.context"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import QRCode from "react-qr-code"
import { nanoid } from 'nanoid'
import { AuthObject } from "@/types/login.verify"
import { ROLES } from "@/constants/user.roles"

type Props = { invition?: string, redirect?: string }

export default function LoginContainer({ invition, redirect }: Props) {

    const { toast } = useToast()
    const [loading, setLoading] = useState<boolean>(false)
    const form = useRef<HTMLFormElement>(null)
    const router = useRouter()
    const { socket } = useSocket()
    const [openLoginVerify, setOpenLoginVerify] = useState<string | null>(null)


    useEffect(() => {

        console.log(redirect)

        socket.on("receive_verify_login", (data: AuthObject) => {
            setCookie("auth", JSON.stringify({
                token: data.token,
                user: {
                    _id: data.user._id,
                    username: data.user.username,
                    role: data.user.role,
                    bio: data.user.bio
                }
            }))

            setOpenLoginVerify(null)

            if (!invition) {
                router.push("/")
            } router.push(`/invition/${invition}`)

            toast({
                duration: 2000,
                description: <p className='text-green-500 font-semibold'>Đăng nhập thành công</p>,
            })
            setLoading(true)
        })
    }, [socket])


    const loginWithGoogle = async () => {
        try {
            const { user } = await signInWithPopup(auth, new GoogleAuthProvider())

            const res = await fetch(process.env.NEXT_PUBLIC_API + "/user/createGoogleUser", {
                headers: { "Content-Type": "application/json" },
                method: "POST",
                body: JSON.stringify({ fullName: user.displayName, email: user.email, provider: "google", avatar: user.photoURL })
            })

            const { data, message, status } = await res.json()
            console.log(data, message, status)

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

                if (invition) router.push(`/invition/${invition}`)
                if (redirect) router.push(`/${redirect}`)
                router.push("/")
            }

        } catch (error) {

        }
    }

    const loginWithFacebook = async () => {
        try {
            const { user } = await signInWithPopup(auth, new FacebookAuthProvider())

            console.log(user)

            const res = await fetch(process.env.NEXT_PUBLIC_API + "/user/createFacebookUser", {
                headers: { "Content-Type": "application/json" },
                method: "POST",
                body: JSON.stringify({
                    fullName: user.displayName,
                    ...(!!user.email && { email: user.email }),
                    ...(!!user.phoneNumber && { phoneNumber: user.phoneNumber }),
                    provider: "facebook",
                    avatar: user.photoURL
                })
            })

            const { data, message, status } = await res.json()
            console.log(data, message, status)

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
            }

        } catch (error: any) {
            console.log(error)
        }
    }

    const login = async (event: React.SyntheticEvent<HTMLFormElement>) => {
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

                console.log(data.user.role.roleName)
                
                
                setCookie("auth", JSON.stringify({
                    token: data.token, user: {
                        _id: data.user._id, username: data.user.username, role: data.user.role, bio: data.user.bio
                    }
                }))

                if (data.user.role.roleName === ROLES.SUPERADMIN) {
                    console.log("hien thi popup")
                    
                }

                toast({
                    title: message,
                    duration: 2000,
                    description: <p className='text-green-500 font-semibold'>{message}</p>,
                })
                setLoading(true)
                
                if (redirect) {
                    router.push(`/account/disable-account`)
                    return
                } else if (invition) {
                    router.push(`/invition/${invition}`)
                    return
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

    const loginWithPhone = async () => {

        const client = nanoid()
        socket.emit("pre_verify_login", client)

        setOpenLoginVerify(JSON.stringify({ client }))

        /*
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
                    token: data.token,
                    user: {
                        _id: data.user._id,
                        username: data.user.username,
                        role: data.user.role,
                        bio: data.user.bio
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
        */
    }

    return <div className="bg-white border-t-2 w-[450px] shadow-sm shadow-white rounded-lg p-8 flex flex-col justify-center items-center">
        {loading && <div className="fixed top-[45%] left-[45%]">
            <img src="/icons/loading.svg" alt="" />
        </div>}

        <Dialog open={!!openLoginVerify} onOpenChange={() => setOpenLoginVerify(null)}>
            <DialogContent className="p-0 m-0 outline-none border-none rounded-none">

                <div className="header bg-sky-500 flex items-center px-6 h-12">
                    <h2 className="font-semibold text-base text-white">Xác thực đăng nhập trên điện thoại</h2>
                </div>

                {openLoginVerify && <div className="p-4 flex flex-col items-center justify-center">
                    <QRCode
                        size={256}
                        style={{ height: "auto", maxWidth: "50%", width: "50%" }}
                        value={openLoginVerify}
                        viewBox={`0 0 256 256`}
                    />

                    <img src="/icons/loader3.svg" className="mt-4 w-14 h-14" alt="" />

                    <h3 className="my-4 text-lg font-semibold">Đăng nhập GOZA bằng điện thoại của bạn</h3>
                    <ul className="mb-2">
                        <li className="text-sm font-semibold text-gray-600">1. Mở GOZA trên điện thoại của bạn</li>
                        <li className="text-sm font-semibold text-gray-600">2. Vào phần cài đặt để kết nối điện thoại với máy tính</li>
                        <li className="text-sm font-semibold text-gray-600">3. Quét mã QR trên để hoàn tất việc đăng nhập</li>
                    </ul>
                    <li className="text-sm font-semibold text-red-500">Lưu ý: Không tắt màn hình này trong quá trình đăng nhập</li>
                </div>}
            </DialogContent>
        </Dialog>

        <form ref={form} onSubmit={login} className="bg-white w-[450px] shadow-sm shadow-white rounded-lg p-8 flex flex-col justify-center items-center">
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

                <button type="submit" className='text-white w-full hover:bg-sky-400 font-semibold duration-150 shadow-md shadow-white rounded-lg py-2 bg-sky-500'>Đăng Nhập</button>
            </div>
        </form>

        <button type="button" onClick={loginWithPhone} className='text-white w-full font-semibold duration-150 shadow-md shadow-white rounded-lg py-2 px-6 from-cyan-500 to-blue-500 bg-gradient-to-r'>
            Đăng nhập bằng điện thoại
        </button>



        <div className="my-4 w-full flex space-x-2 items-center justify-center">
            <div className="h-[2px] w-[120px] bg-gray-300" />
            <p className="font-semibold text-gray-600 text-sm">Hoặc đăng nhập với</p>
            <div className="h-[2px] w-[120px] bg-gray-300" />
        </div>

        <div className="flex space-x-2 w-full">
            <button onClick={loginWithGoogle} className="bg-black w-[50%] rounded-md px-4 py-2 text-white flex justify-center items-center space-x-2">
                <FcGoogle className="text-lg" />
                <span className="font-semibold">Google</span>
            </button>
            <button onClick={loginWithFacebook} className="bg-[#4267B2] w-[50%] rounded-md px-4 py-2 text-white flex justify-center items-center space-x-2">
                <FaFacebook className="text-lg" />
                <span className="font-semibold">Facebook</span>
            </button>
        </div>
    </div>
}