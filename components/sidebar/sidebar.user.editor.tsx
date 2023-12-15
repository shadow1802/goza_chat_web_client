"use client"
import { ChangeEvent, FC, FormEvent, useRef, useState } from "react";
import { HiOutlineMail, HiUser, HiOutlineRss, HiOutlineStatusOnline } from "react-icons/hi"
import { AiOutlineUser, AiOutlinePhone } from "react-icons/ai"
import { useAuthState } from "@/context/Auth.context";
import useInvoker from "@/utils/useInvoker";
import { useLobbyContext } from "@/context/Lobby.context";
import { useToast } from "@/components/ui/use-toast"
import UploadService from "@/utils/s3.service";
type Props = {}

const UserEditor: FC<Props> = (props) => {

    const { authState } = useAuthState()
    const { currentUser, setCurrentUser } = useLobbyContext()
    const { toast } = useToast()
    const invoker = useInvoker()

    const [localAvatarPreview, setLocalAvatarPreview] = useState<string | null>(null)

    const usernameRef = useRef<HTMLInputElement>(null)
    const fullNameRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)
    const phoneNumberRef = useRef<HTMLInputElement>(null)
    const bioRef = useRef<HTMLInputElement>(null)
    const fileRef = useRef<HTMLInputElement>(null)

    const handleChangeBufa = async () => {
        const controller = new AbortController()
        try {
            const { status, data, message } = await invoker.put("/user/changeBufaByToken")
            if (currentUser) {
                setCurrentUser({ ...currentUser, bufa: data })
            }
        } catch (error) {

        } finally {
            controller.abort()
        }
    }

    const handleUpdateUser = async (event: FormEvent) => {
        event.preventDefault()
        const controller = new AbortController()

        let fullName = fullNameRef.current?.value
        let password = passwordRef.current?.value
        let email = emailRef.current?.value
        let phoneNumber = phoneNumberRef.current?.value
        let bio = bioRef.current?.value
        let files = fileRef.current?.files

        try {

            let avatarLink = ''

            if (files && files.length > 0) {
                const params = {
                    Body: files[0],
                    Bucket: "luongsonchatapp",
                    Key: `admins/${currentUser?._id}/${new Date().getTime()}_${files[0].name}`,
                    ACL: "public-read"
                };

                await UploadService.uploader(params as any)

                avatarLink = `https://luongsonchatapp.sgp1.digitaloceanspaces.com/${params.Key}`
            }

            const { status, data, message } = await invoker.put("/user/updateUserByToken", {
                ...(!!fullName && ({ fullName })),
                ...(!!password && ({ password })),
                ...(!!email && ({ email })),
                ...(!!phoneNumber && ({ phoneNumber })),
                ...(!!bio && ({ bio })),
                ...(!!avatarLink && ({ avatar: avatarLink }))
            })

            if (status === 200) {
                if (currentUser) {
                    setCurrentUser({ ...currentUser, fullName: data.fullName, email: data.email, phoneNumber: data.phoneNumber, bio: data.bio })
                }
                toast({
                    title: "Thành công",
                    duration: 2000,
                    description: <p className="text-green-600">{message}</p>
                })
            }
        } catch (error) {

        } finally { controller.abort() }
    }

    const handleChangeAvatar = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const src = URL.createObjectURL(event.target.files[0])
            setLocalAvatarPreview(src)
        }
    }

    return <form onSubmit={handleUpdateUser} className="text-gray-600 px-3 py-2 flex-col items-center space-y-3 shadow-black">

        <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center space-x-2 drop-shadow shadow shadow-black">
            <label htmlFor="user_editor_avatar_picker" className="cursor-pointer">

                {
                    localAvatarPreview ?
                        <img src={localAvatarPreview} className="w-14 h-14 rounded-full border-4 border-darkness-500" />
                        : (currentUser?.avatar ?
                            <img src={currentUser.avatar} className="w-14 h-14 bg-sky-500 rounded-full border-4 border-darkness-500" />
                            : <img src="/images/default-avatar.jpg" className="w-14 h-14 bg-sky-500 rounded-full border-4 border-darkness-500" />)
                }
            </label>
            <input onChange={handleChangeAvatar} ref={fileRef} type="file" id="user_editor_avatar_picker" accept="image/*" className="hidden" />
            <div>
                <p className="text-gray-100 uppercase font-semibold text-sm">{currentUser?.fullName}</p>
                <p className="text-gray-200 font-semibold text-xs">@{currentUser?.username}</p>
            </div>
        </div>

        <div className="mt-4 border-gray-300 border-b-[0.5px]">
            <p className="font-semibold text-gray-600 uppercase text-xs my-1 ml-1">tên người dùng</p>
            <div className="flex rounded-md p-2 space-x-2 items-center">
                <AiOutlineUser className="text-gray-400" />
                <input ref={usernameRef} type="text" disabled value={currentUser?.username} className="bg-white text-sm border-none outline-none w-full" />
            </div>
        </div>
        <div className="border-gray-300 border-b-[0.5px]">
            <p className="font-semibold text-gray-600 uppercase text-xs my-1 ml-1">tên hiển thị</p>
            <div className="flex rounded-md p-2 space-x-2 items-center">
                <HiUser className="text-gray-400" />
                <input type="text" ref={fullNameRef} defaultValue={currentUser?.fullName} placeholder="shadow1802" className="bg-white text-sm border-none outline-none w-full" />
            </div>
        </div>
        <div className="border-gray-300 border-b-[0.5px]">
            <p className="font-semibold text-gray-600 uppercase text-xs my-1 ml-1">địa chỉ email</p>
            <div className="flex rounded-md p-2 space-x-2 items-center ">
                <HiOutlineMail className="text-gray-400" />
                <input type="text" ref={emailRef} defaultValue={currentUser?.email} placeholder="---------" className="bg-white text-sm border-none outline-none w-full" />
            </div>
        </div>
        <div className="border-gray-300 border-b-[0.5px]">
            <p className="font-semibold text-gray-600 uppercase text-xs my-1 ml-1">số điện thoại</p>
            <div className="flex rounded-md p-2 space-x-2 items-center ">
                <AiOutlinePhone className="text-gray-400" />
                <input type="text" ref={phoneNumberRef} defaultValue={currentUser?.phoneNumber} placeholder="---------" className="text-sm border-none outline-none w-full " />
            </div>
        </div>
        <div className="border-gray-300 border-b-[0.5px]">
            <p className="font-semibold text-gray-600 uppercase text-xs my-1 ml-1">mật khẩu</p>
            <div className="flex rounded-md p-2 space-x-2 items-center ">
                <img src="/icons/lock-solid.svg" className="w-4 h-4" alt="" />
                <input type="password" ref={passwordRef} placeholder="••••••••" className="text-sm border-none outline-none w-full " />
            </div>
        </div>
        <div className="border-gray-300 border-b-[0.5px]">
            <p className="font-semibold text-gray-600 uppercase text-xs my-1 ml-1">bio</p>
            <div className="flex rounded-md p-2 space-x-2 items-center ">
                <HiOutlineRss className="text-gray-400" />
                <input type="text" ref={bioRef} defaultValue={currentUser?.bio} className="text-sm border-none outline-none w-full " />
            </div>
        </div>
        <div className="border-gray-300 border-b-[0.5px]">
            <p className="font-semibold text-gray-600 uppercase text-xs my-1 ml-1">GOZA</p>
            <div className="flex rounded-md p-2 space-x-2 items-center ">
                <HiOutlineStatusOnline onClick={handleChangeBufa} className="cursor-pointer text-gray-400" />
                <input type="text" value={currentUser?.bufa} disabled className="text-sm border-none outline-none w-full bg-white" />
            </div>
        </div>

        <button className="w-full text-white bg-sky-500 rounded-lg py-2">Xác nhận</button>

    </form>
}

export default UserEditor