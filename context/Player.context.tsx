"use client"
import { Dispatch, FC, ReactNode, SetStateAction, createContext, useContext, useEffect, useState } from "react"
import ReactImageGallery from "react-image-gallery"
import { MdClose } from "react-icons/md"
import Title from "@/components/title"

type Image = {
    original: string,
    thumbnail: string,
}

const PlayerContext = createContext<{
    showImagePlayer: boolean,
    setShowImagePlayer: Dispatch<SetStateAction<boolean>>,
    imagePlayerData: Image[],
    setImagePlayerData: Dispatch<SetStateAction<Image[]>>
}>({
    showImagePlayer: false,
    setShowImagePlayer: () => null,
    imagePlayerData: [],
    setImagePlayerData: () => null
})

type ProviderProps = { children: ReactNode }

const PlayerProvider: FC<ProviderProps> = ({ children }) => {

    const [showImagePlayer, setShowImagePlayer] = useState<boolean>(false)
    const [imagePlayerData, setImagePlayerData] = useState<Image[]>([])

    useEffect(() => {
        document.addEventListener('keydown', function (event) {
            const key = event.key;
            if (key === "Escape") {
                setImagePlayerData([])
            }
        })
    }, [])

    return <PlayerContext.Provider value={{ showImagePlayer, setShowImagePlayer, imagePlayerData, setImagePlayerData }}>
        {children}

        <div className={`${imagePlayerData.length === 0 && "hidden"} fixed flex items-center justify-center w-screen bg-black bg-opacity-25 h-screen top-0 left-0 pt-5`}>
            <ReactImageGallery
                showFullscreenButton={false}
                renderThumbInner={()=><></>}

                renderItem={
                    (item) => <div className="max-h-[85vh] relative from-cyan-500 to-blue-500 bg-gradient-to-r p-3 rounded-lg flex items-center justify-center flex-col">
                        <div className="flex space-x-2 items-center mb-2 w-full">
                            <button onClick={()=>setImagePlayerData([])} className="flex items-center justify-center cursor-pointer p-[2px] rounded-full text-red-500 bg-white shadow-md"><MdClose /></button>
                            <p className="text-white font-semibold text-sm">{item.original.split("/").pop()}</p>

                        </div>
                        <div className="absolute top-5 right-4">
                            <Title size={16}/>
                        </div>
                        <img src={item.original} className="rounded-lg" style={{ maxWidth: "85vw", maxHeight: "80vh" }} />
                    </div>
                }
                stopPropagation onSlide={(i) => console.log(i)} items={imagePlayerData} renderRightNav={() => <div className="fixed w-full h-8 bg-red-500"></div>} />


        </div>
    </PlayerContext.Provider>
}

export default PlayerProvider

export const usePlayer = () => useContext(PlayerContext)