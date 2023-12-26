import InvitionContainer from "./invition.container";

const loader = async (invitionId: string) => {
    try {
        const res = await fetch(`${process.env.HOST}/room/getInvite/${invitionId}`)
        const { status, data, message } = await res.json()

        if (status !== 200) {
            return { data: null, isSuccessLoaded: false }
        } else return { isSuccessLoaded: true, data: data }
    } catch (error: any) {
        console.log(error)
        return { data: null, isSuccessLoaded: false }
    }
}

type PageContext = { params: { invition: string } }
export default async function Invite({ params }: PageContext) {

    const { data, isSuccessLoaded } = await loader(params.invition)

    return <div className="flex w-screen min-h-screen flex-1 flex-col justify-center items-center from-cyan-500 to-blue-500 bg-gradient-to-r">
        <InvitionContainer detail={data} isSuccessLoaded={isSuccessLoaded}/>
    </div>
}