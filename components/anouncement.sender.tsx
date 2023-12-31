"use client"

import { useRoomContext } from "@/context/Room.context"
import useInvoker from "@/utils/useInvoker"
import { MdOutlineAttachFile } from "react-icons/md"
import { ChangeEvent, Dispatch, FC, SetStateAction, useCallback, useRef, useState } from "react"
import { toast } from "./ui/use-toast"
import useAuthValue from "@/utils/useAuthValue"
import UploadService from "@/utils/s3.service"
import { useSocket } from "@/context/Socket.context"

type Props = {
    setShowAnouncementSender: Dispatch<SetStateAction<boolean>>
    setFileDinhKem: Dispatch<SetStateAction<File | null | undefined>>
    onSubmit: (event: React.SyntheticEvent<HTMLFormElement>) => Promise<void>
    fileDinhKem: File | null | undefined
}

const AnouncementSender: FC<Props> = ({ setFileDinhKem, onSubmit, fileDinhKem }) => {

    const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        //console.log("file changed", event.target.files)
        event.target.files && setFileDinhKem(event.target.files[0])

    }

    return <div className="">
        <div className="anouncementSender_header bg-gradient-to-r py-3 from-cyan-500 to-blue-500 flex w-full px-4">
            <p className="text-white font-semibold">Gửi thông báo</p>
        </div>

        <form onSubmit={onSubmit} className="p-4">
            <textarea name="anouncement_content" className="p-2 text-gray-600 w-full border-2 rounded-md h-60" />

            <div className="w-full rounded-md border-2 mb-1 px-4 py-2">
                <label htmlFor="anouncement_file" className="cursor-pointer flex w-full items-center space-x-2 justify-between">
                    <p className="text-black text-sm font-semibold">
                        {fileDinhKem ? `${fileDinhKem.name}` : `Đính kèm file, hình ảnh, ...`}
                    </p>
                    <MdOutlineAttachFile className="text-lg text-gray-600" />
                </label>
                <input type="file" onChange={(event) => onFileChange(event)} name="anouncement_file" className="hidden" id="anouncement_file" />
            </div>

            <button type="submit" className="w-full py-1 bg-sky-500 text-white font-semibold">Gửi</button>
        </form>

    </div>
}

export default AnouncementSender