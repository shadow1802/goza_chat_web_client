import RoomProvider from "@/context/Room.context"
import ServerLoader from "@/utils/serverLoader"


const loader = async(room: string) => {
    const serverLoader = new ServerLoader()

    const [messages, roomDetail] = await Promise.all([
        serverLoader.getMessages(room),
        serverLoader.getRoomDetailById(room)
    ])

    return {messages: messages.data, roomDetail}
}

type Props = {
    children: React.ReactNode
    params: { room: string }
}

export default async function RoomLayout(props: Props) {

    const {messages, roomDetail} = await loader(props.params.room)

    return <main className="bg-[#1F1D1E] flex-grow">
        <RoomProvider initialMessages={messages} initialRoomDetail={roomDetail}>
            { props.children }
        </RoomProvider>
    </main>
}