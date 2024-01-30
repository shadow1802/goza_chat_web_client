"use client"

import { ComponentProps } from "react";
import { BiSolidDashboard } from "react-icons/bi"

type Props = {} & ComponentProps<"aside">
export default function Sidebar({ ...rest }: Props) {

    let menus = [
        {
            title: "Reports",
            url: "admin/reports"
        }
    ]

    return <aside {...rest} className="admin_sidebar p-3 min-h-screen w-[300px] bg-sky-500">
        {
            menus.map((item, key) => <button key={key} className="py-2 flex space-x-2 items-center text-white">
                <BiSolidDashboard />
                <span className="">{item.title}</span>
            </button>)
        }
    </aside>
}