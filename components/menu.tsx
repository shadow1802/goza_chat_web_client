"use client"
import { FC, ReactNode } from "react"
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"

type Props = {
    list: ReactNode[],
    children: ReactNode
}

const Menu: FC<Props> = ({ list, children }) => {

    return <ContextMenu>
        <ContextMenuTrigger>{ children }</ContextMenuTrigger>
        <ContextMenuContent className="min-w-[200px]">
            { list.map((item, index) => <ContextMenuItem key={index}>
                { item }
            </ContextMenuItem>) }
        </ContextMenuContent>
    </ContextMenu>
}

export default Menu