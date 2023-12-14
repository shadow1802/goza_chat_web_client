import useInvoker from "@/utils/useInvoker"
import { FC, useEffect, useState } from "react"
import { useParams } from "next/navigation"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { CiFileOn } from "react-icons/ci"
import { dateTimeConverter } from "@/utils/dateTimeConverter"
import { IoDocument } from "react-icons/io5"
import { truncate } from "@/utils/helper"

type FileObject = {
    Key: string
    LastModified: string
    ETag: string
    Size: number
    StorageClass: string
}

type Props = { type: 'image' | 'video' | 'document' }

const Files: FC<Props> = ({ type }) => {

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [files, setFiles] = useState<FileObject[]>([])
    const { room } = useParams()
    const invoker = useInvoker()

    const fileLoader = async () => {
        try {
            setIsLoading(true)
            const data = await invoker.post("/file/byPath", { path: room + "/" + type })
            setFiles(data)
            setIsLoading(false)
        } catch(error) {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fileLoader()
    }, [])

    const render: { [key: string]: (file: FileObject) => React.ReactNode } = {
        "video": (file: FileObject) => <video src={process.env.NEXT_PUBLIC_DO_END_POINT + "/" + file.Key} className="w-full h-28" controls />,
        "image": (file: FileObject) => <img src={process.env.NEXT_PUBLIC_DO_END_POINT + "/" + file.Key} className="w-full h-28" />,
        "document": (file: FileObject) => <div className="flex items-center space-x-2 rounded-lg py-1 px-2">
            <IoDocument className="text-4xl text-sky-500" />
            <div>
                <a href={process.env.NEXT_PUBLIC_DO_END_POINT + "/" + file.Key} className="text-sky-500">{truncate(file.Key.split("_").pop() as string, 45)}</a>
                <p className="text-xs">{(file.Size / 1048576).toFixed(3)} MB</p>
            </div>
        </div>
    }

    return <div className="p-1">
        {isLoading ? <div className="w-full flex justify-center items-center py-12">
            <img src="/icons/loading.svg" className="w-12 h-12" />
        </div> : <div className={`min-h-[150px] ${type === 'document' ? 'space-y-1' : 'grid grid-cols-3 gap-1'}`}>

            {files.map(item => <div key={item.Key}>
                {render[type](item)}
            </div>)}

        </div>}
    </div>
}

export default Files