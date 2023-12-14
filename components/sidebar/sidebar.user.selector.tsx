import {
    Select,
    SelectContent,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
    SelectGroup
} from "@/components/ui/select"
import { useLobbyContext } from "@/context/Lobby.context"
import { useState } from "react"

type Props = {
    setPartner: (userId: string) => void
}

export default function SidebarUserSelector({ setPartner }: Props) {

    const { users, currentUser } = useLobbyContext()

    const userMap = users.map(i => i._id)

    return <Select onValueChange={(value) => setPartner(value)}>
        <SelectTrigger className="w-full py-2">
            <SelectValue placeholder="Chọn 1 người bạn trong danh sách dưới đây" />
        </SelectTrigger>
        <SelectContent>
            <SelectGroup>
                {users.map((u) => <SelectItem key={u._id} value={u._id} className="py-2">
                    <div className="flex items-center space-x-2">
                        {u.avatar ? <img src={u.avatar} alt="" className="w-8 h-8 rounded-full" />
                            : <img src="/images/default-avatar.jpg" alt="" className="w-8 h-8 rounded-full" />}
                        <p className="text-sm font-semibold text-gray-700">{u.fullName} ({u.username})</p>
                    </div>
                </SelectItem>)}
            </SelectGroup>
            <SelectGroup>
                <SelectLabel>Bạn bè</SelectLabel>
                {currentUser?.friends?.filter(item => !userMap.includes(item._id)).map((u) => <SelectItem key={u._id} value={u._id} className="py-2">
                    <div className="flex items-center space-x-2">
                        {u.avatar ? <img src={u.avatar} alt="" className="w-8 h-8 rounded-full" />
                            : <img src="/images/default-avatar.jpg" alt="" className="w-8 h-8 rounded-full" />}
                        <p className="text-sm font-semibold text-gray-700">{u.fullName} ({u.username})</p>
                    </div>
                </SelectItem>)}
            </SelectGroup>

        </SelectContent>
    </Select>
}