import RoomContainer from "./room.container"

type PageContext = { params: { room: string }, searchParams: { [key:string]: string } }

export default async function Room(ctx:PageContext) {
    return <div>
        <RoomContainer />
    </div>
}