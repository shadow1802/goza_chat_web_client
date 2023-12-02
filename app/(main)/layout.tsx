import type { Metadata } from 'next'
import { Toaster } from "@/components/ui/toaster"
import AuthProvider from '@/context/Auth.context'
import LobbyProvider from '@/context/Lobby.context'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
    title: 'Create Next App',
    description: 'Generated by create next app',
}

import ServerLoader from '@/utils/serverLoader'
import { IRoom } from '@/types/room'
import { ICurrentUser, IUser } from '@/types/user'
import Sidebar from '@/components/sidebar/sidebar'
import { cookies } from 'next/headers'
import { AuthState } from '@/types/auth'

export default async function MainLayout({ children }: { children: React.ReactNode }) {

    const cookieStore = cookies()
    const authCookie = cookieStore.get('auth')

    const loader = async (): Promise<{
        rooms: IRoom[],
        users: IUser[],
        currentUser: ICurrentUser | null,
        notifies: any
    }> => {

        try {
            const serverLoader = new ServerLoader()

            const [rooms, users, currentUser, notifies] = await Promise.all([
                serverLoader.getJoinedRooms(),
                serverLoader.getUsers(),
                serverLoader.getCurrentUser(),
                serverLoader.getNotifies()
            ])

            return { rooms, users, currentUser, notifies }

        } catch (error) {
            console.log(error)
            redirect("/login")
        }
    }

    const { rooms, users, currentUser, notifies } = await loader()
    return <main className={`flex w-full min-h-screen`}>
        <LobbyProvider initialCurrentUser={currentUser} initialUsers={users} initialRooms={rooms} initialNotifies={notifies}>
            <Sidebar />
            {children}
        </LobbyProvider>
    </main>
}
