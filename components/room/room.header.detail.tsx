import { IRoomDetail } from "@/types/room.detail";
import useAuthValue from "@/utils/useAuthValue";
import { FC } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import RoomSetting from "./room.setting";
import signName from "@/utils/signName.service";
import colorGenerator from "@/utils/colorGenerator.service";

type PrivateRoomProps = {
    roomDetail?: IRoomDetail | null | undefined
}

export const PrivateRoom: FC<PrivateRoomProps> = ({ roomDetail }) => {
    const auth = useAuthValue()
    const target = roomDetail?.roomUsers.find(item => item.user._id !== auth?.user._id)

    console.log(`target:`, target)

    return <div className="w-full space-x-3 cursor-pointer flex items-center">
        {target && (target?.user?.avatar ? <img src={target?.user?.avatar} className="bg-sky-500 border-2 border-sky-500 w-9 h-9 rounded-full" alt="" />
            : <div className="border-2 border-sky-500 rounded-full w-9 h-9 flex items-center justify-center" style={{ backgroundColor: colorGenerator(target?.user?.fullName) }}>
                <p className="text-white text-sm font-semibold">{signName(target?.user?.fullName)}</p>
            </div>)}
        <div>
            <p className="text-sm font-semibold text-black uppercase">{target?.user.fullName}</p>
            {/*<p className="text-xs font-semibold text-gray-500">{roomDetail?.roomUsers?.length} thành viên</p>*/}
        </div>
    </div>
}

type PublicRoomProps = {
    roomDetail?: IRoomDetail | null | undefined
}

export const PublicRoom: FC<PublicRoomProps> = ({ roomDetail }) => {
    return <Dialog>
        <DialogTrigger asChild>
            <div className="w-full space-x-3 cursor-pointer flex items-center">
                <img src={roomDetail?.roomIcon || "/images/bg.png"} className="bg-sky-500 border-2 border-sky-500 w-9 h-9 rounded-full" alt="" />
                <div>
                    <p className="text-sm font-semibold text-black uppercase">{roomDetail?.roomName}</p>
                    <p className="text-xs font-semibold text-gray-500">{roomDetail?.roomUsers?.length} thành viên</p>
                </div>
            </div>
        </DialogTrigger>
        <DialogContent className="rounded-none p-0 border-none gap-0">
            <DialogHeader className="border-none rounded-none m-0 p-4 bg-sky-500 h-10 rounded-t-lg">
                <DialogTitle className="text-gray-200 text-base font-semibold">Thiết lập</DialogTitle>
            </DialogHeader>

            <RoomSetting />

        </DialogContent>
    </Dialog>
}