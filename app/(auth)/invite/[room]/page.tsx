import InviteContainer from "./invite.container";

const loader = async (roomId: string) => {
    try {
        const res = await fetch(`${process.env.HOST}/room/getRoomById/${roomId}`)
        const { status, data } = await res.json()
        if (status !== 200) {
            return { data: `Lời mời không hợp lệ`, isSuccessLoaded: false }
        } else return { isSuccessLoaded: true, data }
    } catch (error: any) {
        console.log(error)
        return { data: `Lời mời không hợp lệ`, isSuccessLoaded: false }
    }
}

type PageContext = { params: { room: string } }
export default async function Invite({ params }: PageContext) {

    const { data, isSuccessLoaded } = await loader(params.room)

    return <div className="flex w-screen min-h-screen flex-1 flex-col justify-center items-center from-cyan-500 to-blue-500 bg-gradient-to-r">
        <InviteContainer roomDetail={data} isSuccessLoaded={isSuccessLoaded}/>
    </div>
}