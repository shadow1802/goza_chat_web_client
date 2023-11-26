import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useLobbyContext } from "@/context/Lobby.context"
import { useState } from "react"

type Props = {
    setPartner: (userId: string) => void
}

export default function SidebarUserSelector({ setPartner }:Props) {

    const { users } = useLobbyContext()

    return <Select onValueChange={(value) => setPartner(value)}>
        <SelectTrigger className="w-full py-2">
            <SelectValue placeholder="Chọn 1 người bạn trong danh sách dưới đây" />
        </SelectTrigger>
        <SelectContent>
            {users.map(u => <SelectItem key={u._id} value={u._id} className="py-2">
                <div className="flex items-center space-x-2">
                    <img src={u.avatar} alt="" className="w-8 h-8" />
                    <p className="text-sm font-semibold text-gray-700">{u.fullName} ({u.username})</p>
                </div>
            </SelectItem>)}
        </SelectContent>
    </Select>
}