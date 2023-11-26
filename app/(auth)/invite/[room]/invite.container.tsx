"use client"
import { IRoomDetail } from "@/types/room.detail"
import useAuthValue from "@/utils/useAuthValue"
import useInvoker from "@/utils/useInvoker"
import { useRouter } from "next/navigation"

type Props = {
    roomDetail?: IRoomDetail
    isSuccessLoaded: boolean
}

export default function InviteContainer({ roomDetail, isSuccessLoaded }: Props) {

    const invoker = useInvoker()
    const authValue = useAuthValue()
    const router = useRouter()
    const owner = isSuccessLoaded && roomDetail?.roomUsers.find(item => item.user._id === roomDetail.roomOwner)

    const handleAcceptInvite = async () => {
        if (authValue && roomDetail) {
            const { status, data } = await invoker.post("/usersrooms/insert", {
                userId: authValue.user._id,
                roomId: roomDetail._id
            })
            if (status === 302) {
                router.push(`/${data.room}`)
            } else {
                router.push(`/${data.room}`)
            }
        } else {
            if (roomDetail) {
                router.push(`/login?invite=${roomDetail._id}`)
            }
        }
    }

    return isSuccessLoaded ? <div className="bg-white min-w-[450px] rounded-lg shadow-lg drop-shadow-lg p-6 flex flex-col justify-center items-center">
        <img src={roomDetail?.roomIcon} alt="" className="shadow-lg drop-shadow-lg w-32 h-32 border-sky-500 border-8 rounded-full" />
        <div className="mt-3 flex flex-col justify-center items-center">
            <p>{owner && <span className="text-sky-500 font-semibold">{owner.user.fullName}</span>} đã mời bạn vào phòng</p>
            <p className="text-xl font-semibold">{roomDetail?.roomName}</p>
            <p className="text-sm font-semibold text-gray-500">{roomDetail?.roomUsers.length} thành viên</p>
        </div>
        <button onClick={handleAcceptInvite} className="mt-2 from-cyan-500 to-blue-500 bg-gradient-to-r w-full rounded-lg text-white py-2 font-semibold">Chấp nhận lời mời</button>
    </div> : <div className="bg-white min-w-[450px] rounded-lg shadow-lg drop-shadow-lg p-6 flex flex-col justify-center items-center">
        <p>Lời mời không hợp lệ</p>
    </div>
}