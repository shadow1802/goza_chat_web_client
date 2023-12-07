"use client"
import { Invition } from "@/types/invition"
import { IRoomDetail } from "@/types/room.detail"
import useAuthValue from "@/utils/useAuthValue"
import useInvoker from "@/utils/useInvoker"
import { useRouter } from "next/navigation"

type Props = {
    detail?: Invition
    isSuccessLoaded: boolean
}

export default function InviteContainer({ detail, isSuccessLoaded }: Props) {

    const invoker = useInvoker()
    const authValue = useAuthValue()
    const router = useRouter()
    
    console.log(detail)

    const handleAcceptInvite = async () => {
        if (authValue && detail) {
            const { status, data } = await invoker.post("/usersrooms/insert", {
                userId: authValue.user._id,
                roomId: detail.room._id
            })
            if (status === 302) {
                router.push(`/${data.room}`)
            } else {
                router.push(`/${data.room}`)
            }
        } else {
            if (detail) {
                router.push(`/login?invition=${detail.room._id}`)
            }
        }
    }

    return isSuccessLoaded ? <div className="bg-white min-w-[450px] rounded-lg shadow-lg drop-shadow-lg p-6 flex flex-col justify-center items-center">
       <img src={detail?.room.roomIcon} alt="" className="w-32 h-32 border-8 border-sky-500 rounded-full" />
       <p className="mt-2 text-sky-500 text-lg font-semibold">{detail?.room.roomName}</p>
       <p className="font-semibold">{detail?.room.roomUsers.length} thành viên</p>
       <button onClick={handleAcceptInvite} className="w-full bg-sky-500 py-2 rounded-md text-white font-semibold mt-2">Chấp nhập lời mời</button>
    </div> : <div className="bg-white min-w-[450px] rounded-lg shadow-lg drop-shadow-lg p-6 flex flex-col justify-center items-center">
        <p className="my-2 text-lg font-semibold">Lời mời không hợp lệ hoặc đã hết hạn</p>
    </div>
}