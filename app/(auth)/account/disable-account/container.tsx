"use client"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import useInvoker from "@/utils/useInvoker"
import { useState } from "react"
import { CiLock } from "react-icons/ci"
import { deleteCookie } from "cookies-next"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

export default function Container() {

    const router = useRouter()
    const [password, setPassword] = useState<string>("")
    const invoker = useInvoker()
    const { toast } = useToast()

    const handleDisableAccount = async () => {
        const { data, status, message } = await invoker.put("/user/disableAccount", {
            password
        })

        console.log(data)

        if (status === 200) {
            deleteCookie("auth")
            router.push("/login")
        } else {
            toast({
                title: message,
                duration: 2000,
                description: <p className='text-red-500 font-semibold'>{message}</p>,
            })
        }
    }

    return <div>
        <div className="bg-gray-100 py-2 px-6">
            <p>Nếu bạn không muốn sử dụng dịch vụ của chúng tôi, bạn có thể trực tiếp tạm ngưng tài khoản của bạn</p>
            <p>Sau khi tài khoản của bạn bị tạm ngưng, bạn vẫn có thể khôi phục lại bất cứ lúc nào</p>
        </div>
        <div className="px-6">
            <Dialog>
                <DialogTrigger asChild>
                    <button className="bg-red-500 rounded-md px-6 py-2 text-white text-sm">Xóa tài khoản</button>
                </DialogTrigger>
                <DialogContent className="border-none outline-none rounded-none p-0 m-0">
                    <div className="bg-sky-500 w-full px-4 py-3">
                        <p className="text-sm font-semibold text-white">Xác nhận tạm ngưng tài khoản của bạn</p>
                    </div>
                    <div className="bg-white w-full text-sm px-4">
                        Vui lòng nhập mật khẩu của bạn để hoàn tất việc tạm ngưng tài khoản
                        <div className="flex items-center mt-2 w-full space-x-2 border-2 py-1 rounded-md px-2">
                            <CiLock />
                            <input onChange={(e) => setPassword(e.target.value)} type="password" className="w-full border-none outline-none" placeholder="Mật khẩu" />
                        </div>

                        <div className="my-4">
                            <button onClick={handleDisableAccount} className="bg-red-500 px-4 py-1 text-white rounded-md">Xác nhận</button>
                        </div>

                    </div>
                </DialogContent>
            </Dialog>
        </div>
    </div>
}