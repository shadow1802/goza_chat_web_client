import Sidebar from "@/components/(admin)/sidebar"
import { ReactNode } from "react"

export default function AdminLayout({ children }: { children: ReactNode }) {
    return <div className="flex w-screen min-h-screen">
        <Sidebar />
        { children }
    </div>
}