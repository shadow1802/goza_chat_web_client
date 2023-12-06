"use client"
import { useRef, type FC, ChangeEventHandler, ChangeEvent, useState, FormEvent } from "react"
import Scanner from "./form/scanner"
import { RiSendPlane2Line } from "react-icons/ri"
import UploadService from "@/utils/s3.service"
import useAuthValue from "@/utils/useAuthValue"
type Props = {
    handleSendMessageWithFile: (message: string, file: string) => void
}

const MediaSender: FC<Props> = ({ handleSendMessageWithFile }) => {

    const fileRef = useRef<HTMLInputElement>(null)
    const [message, setMessage] = useState<string>("")
    const [previewUrl, setPreviewUrl] = useState<string>("")
    const authValue = useAuthValue()

    const onFileSelected = () => {
        if (fileRef?.current?.files) {
            const src = URL.createObjectURL(fileRef.current.files[0])
            setPreviewUrl(src)
        }
    }

    const onSendMessageWithFile = async (event: FormEvent) => {

        event.preventDefault()

        if (fileRef?.current?.files) {
            const params = {
                Body: fileRef.current.files[0],
                Bucket: "luongsonchatapp",
                Key: `users/${authValue?.user._id}/${new Date().getTime()}_${fileRef.current.files[0].name}`,
                ACL: "public-read"
            };

            await UploadService.uploader(params as any)

            const link = `https://luongsonchatapp.sgp1.digitaloceanspaces.com/${params.Key}`

            handleSendMessageWithFile(message, link)
        }
    }

    return <form onSubmit={onSendMessageWithFile} className="">
        <div className="media_sender_header from-cyan-500 to-blue-500 bg-gradient-to-r h-12 px-4 flex items-center">
            <p className="font-semibold text-gray-100">Tải ảnh lên</p>
        </div>
        <div className={`media_sender_body w-full min-h-[220px] bg-white ${!previewUrl && "p-4"}`}>
            <label htmlFor="media_image_sender"
                className={`cursor-pointer w-full min-h-[220px] flex flex-col items-center justify-center rounded-lg ${!previewUrl && "border-dashed border-2"}`}>
                {previewUrl ? <img className="bg-darkness-500" src={previewUrl} /> : <p className="text-sm font-semibold text-gray-600">Tải ảnh lên</p>}
            </label>
            <input type="file" ref={fileRef} onChange={onFileSelected} id="media_image_sender" className="hidden" accept="image/*" multiple />
            {previewUrl && <div className="px-4">
                <Scanner onChange={(e: any) => setMessage(e.target.value)} icon={<RiSendPlane2Line className="text-sky-500" />} placeholder="Nhập tin nhắn" name="mesage" />
            </div>}
        </div>
    </form>
}

export default MediaSender