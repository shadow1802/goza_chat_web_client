import { FC, ReactNode, use, useEffect, useState } from "react"
import { SheetContent } from "../ui/sheet"
import { MdPhotoLibrary } from "react-icons/md"
import useAuthValue from "@/utils/useAuthValue"
import { Media } from "@/types/media"
import LazyLoad from 'react-lazy-load'
import useInvoker from "@/utils/useInvoker"

type Props = {
    isOpen: boolean
}

const MediaViewer: FC<Props> = ({ isOpen }) => {

    const authValue = useAuthValue()
    const [medias, setMedias] = useState<Media[]>([])
    const invoker = useInvoker()

    const loader = async () => {
        const { data, message, status } = await invoker.get("/media/paging")
        setMedias(data)
        console.log(data)
    }

    const renderMedia: { [key: number]: (item: Media) => ReactNode } = {
        1: (item) => <LazyLoad height={155} className="">
            <img src={item.src} className="h-[155px] w-full" />
        </LazyLoad>,
        2: (item) => <LazyLoad height={155} className="">
            <video src={item.src} style={{height: '155px', width: '100%'}} controls />
        </LazyLoad>
    }

    useEffect(() => {
        if (isOpen) {
            loader()
        }
    }, [isOpen])

    return <SheetContent className="p-0 m-0">
        <div className="header bg-sky-500 px-4 py-[1.1rem]">
            <p className="flex items-center space-x-2 font-semibold text-white">
                <MdPhotoLibrary className="text-lg text-white" />
                <span className="text-sm">Thư viện của bạn</span>
            </p>
        </div>
        <div className="grid grid-cols-3 gap-1 p-2">
            {
                medias.map(item => <div key={item._id}>
                    {renderMedia[item.fileType](item)}
                </div>)
            }
        </div>
    </SheetContent>
}

export default MediaViewer