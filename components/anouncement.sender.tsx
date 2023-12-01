"use client"

import { useRoomContext } from "@/context/Room.context"
import useInvoker from "@/utils/useInvoker"
import { MdOutlineAttachFile } from "react-icons/md"
import { ChangeEvent, Dispatch, FC, SetStateAction, useState } from "react"
import { toast } from "./ui/use-toast"
import useAuthValue from "@/utils/useAuthValue"
import UploadService from "@/utils/s3.service"

type Props = {
    setShowAnouncementSender: Dispatch<SetStateAction<boolean>>
}

const AnouncementSender: FC<Props> = ({ setShowAnouncementSender }) => {

    const invoker = useInvoker()
    const { roomDetail } = useRoomContext()
    const authValue = useAuthValue()
    const [currentFile, setCurrentFile] = useState<{ name: string, path: string } | null>(null)

    const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const src = URL?.createObjectURL(event.target.files[0])
            setCurrentFile({ name: event.target.files[0].name, path: src })
        }
    }

    const onSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
        const form = event.currentTarget
        const { anouncement_content, anouncement_file } = form.elements as typeof form.elements & {
            anouncement_content: { value: string },
            anouncement_file: { files: FileList }
        }

        let link = ""

        if (anouncement_file.files.length > 0) {
            const params = {
                Body: anouncement_file.files[0],
                Bucket: "luongsonchatapp",
                Key: `admins/${authValue?.user._id}/${new Date().getTime()}_${anouncement_file.files[0].name}`,
                ACL: "public-read"
            };

            await UploadService.uploader(params as any)

            link = `https://luongsonchatapp.sgp1.digitaloceanspaces.com/${params.Key}`
        }

        const { status, message } = await invoker.post("/room/notify/create", {
            roomId: roomDetail?._id,
            message: anouncement_content.value,
            ...(anouncement_file.files.length > 0 && { file: link })
        })

        if (status === 200) {
            setShowAnouncementSender(false)
        } else {
            toast({ title: "Không thể gửi thông báo", description: <p className="text-sm text-red-500">{message}</p> })
        }
    }

    return <div className="">
        <div className="anouncementSender_header bg-gradient-to-r py-3 from-cyan-500 to-blue-500 flex w-full px-4">
            <p className="text-white font-semibold">Gửi thông báo</p>
        </div>

        <form onSubmit={onSubmit} className="p-4">
            <textarea name="anouncement_content" className="p-2 text-gray-600 w-full border-2 rounded-md h-60" />

            <div className="w-full rounded-md border-2 mb-1 px-4 py-2">
                <label htmlFor="anouncement_file_picker" className="flex w-full items-center space-x-2 justify-between">
                    <p className="text-black text-sm font-semibold">
                        {currentFile ? `${currentFile.name}` : `Đính kèm file, hình ảnh, ...`}
                    </p>
                    <MdOutlineAttachFile className="text-lg text-gray-600" />
                </label>
                <input type="file" onChange={(event) => onFileChange(event)} name="anouncement_file" className="hidden" id="anouncement_file_picker" />
            </div>

            <button type="submit" className="w-full py-1 bg-sky-500 text-white font-semibold">Gửi</button>
        </form>

    </div>
}

export default AnouncementSender