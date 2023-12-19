import RoomProvider from "@/context/Room.context"
import ServerLoader from "@/utils/serverLoader"


const loader = async (room: string) => {
    console.time("Time this")
    const serverLoader = new ServerLoader()

    const [messages, roomDetail, anouncements] = await Promise.all([
        serverLoader.getMessages(room),
        serverLoader.getRoomDetailById(room),
        serverLoader.getAnouncement(room)
    ])

    console.log("Load: end")

    return { messages: messages.data, roomDetail, anouncements }
}

type Props = {
    children: React.ReactNode
    params: { room: string }
}

export default async function RoomLayout(props: Props) {

    const { messages, roomDetail, anouncements } = await loader(props.params.room)

    return <main className="bg-[#1F1D1E] flex-grow">
        <RoomProvider initialMessages={messages} initialRoomDetail={roomDetail} initAnouncements={anouncements}>
            {props.children}
        </RoomProvider>
    </main>
}