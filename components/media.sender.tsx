"use client"
import { useRef, type FC, useState, FormEvent } from "react"
import Scanner from "./form/scanner"
import { useToast } from "@/components/ui/use-toast"
import { RiSendPlane2Line } from "react-icons/ri"
import UploadService from "@/utils/aws.service"
import useAuthValue from "@/utils/useAuthValue"
import { useRoomContext } from "@/context/Room.context"
import { IMAGE_TYPES, VIDEO_TYPES } from "@/constants/file.types"
import { useLobbyContext } from "@/context/Lobby.context"
import useInvoker from "@/utils/useInvoker"
type Props = {
    handleSendMessageWithFile: (message: string, file: string) => void
}

const MediaSender: FC<Props> = ({ handleSendMessageWithFile }) => {

    const invoker = useInvoker()
    const fileRef = useRef<HTMLInputElement>(null)
    const { roomDetail } = useRoomContext()
    const { currentUser } = useLobbyContext()
    const [message, setMessage] = useState<string>("")
    const [previewUrl, setPreviewUrl] = useState<string>("")
    const authValue = useAuthValue()
    const [uploadPercent, setUploadPercent] = useState<number>(0)
    const { toast } = useToast()

    const onFileSelected = () => {
        if (fileRef?.current?.files) {
            if (fileRef.current.files[0]) {
                const src = URL.createObjectURL(fileRef.current.files[0])
                setPreviewUrl(src)
            }
        }
    }

    const onSendMessageWithFile = async (event: FormEvent) => {

        event.preventDefault()

        let type = "document"

        if (fileRef?.current?.files && fileRef.current.files[0]) {

            const ext = fileRef.current.files[0].name.split(".").pop()

            if (ext && IMAGE_TYPES.includes(ext)) {
                type = "image"
            }
            if (ext && VIDEO_TYPES.includes(ext)) {
                type = "video"
            }

            const params = {
                Body: fileRef.current.files[0],
                Bucket: "luongsonchatapp",
                Key: `${roomDetail?._id}/${type}/${authValue?.user._id}/${Date.now()}_${fileRef.current.files[0].name}`,
                ACL: "public-read"
            };

            await UploadService.uploader(params as any, (process) => {
                setUploadPercent(process.loaded)
            })

            const link = `https://luongsonchatapp.sgp1.digitaloceanspaces.com/${params.Key}`

            const savedFile = await invoker.post("/file/create", { room: roomDetail?._id, src: link, fileType: type, size: fileRef.current.files[0].size })

            handleSendMessageWithFile(message, link)
        } else {
            toast({
                duration: 2000,
                description: <p className='text-red-500 font-semibold'>Xin vui lòng chọn file</p>,
            })
        }
    }

    return <form onSubmit={onSendMessageWithFile} className="">
        <div className="media_sender_header from-cyan-500 to-blue-500 bg-gradient-to-r h-12 px-4 flex items-center">
            <p className="font-semibold text-gray-100">Tải tệp tin lên</p>
        </div>
        <div className={`media_sender_body w-full min-h-[220px] bg-white ${!previewUrl && "p-4"}`}>
            <label htmlFor="media_image_sender"
                className={`cursor-pointer w-full min-h-[220px] flex flex-col items-center justify-center rounded-lg ${!previewUrl && "border-dashed border-2"}`}>
                {previewUrl ? <img className="bg-darkness-500" src={previewUrl} /> : <p className="text-sm font-semibold text-gray-600">Vui lòng chọn tệp tin</p>}
            </label>
            <input type="file" ref={fileRef} onChange={onFileSelected} id="media_image_sender" className="hidden" accept="audio/*|video/*|image/*" multiple />
            {previewUrl && <div className="px-4">
                <Scanner onChange={(e: any) => setMessage(e.target.value)} icon={<RiSendPlane2Line className="text-sky-500" />} placeholder="Nhập tin nhắn" name="mesage" />
                <button type="submit" className="my-2 font-semibold text-white w-full px-2 from-cyan-500 to-blue-500 bg-gradient-to-l py-1 rounded-md">Gửi</button>
            </div>}
        </div>
    </form>
}

export default MediaSender