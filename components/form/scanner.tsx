"use client"
import { FC, ReactNode } from "react"
import { Label } from "../ui/label"
import { CiMail } from "react-icons/ci"

type Props = { icon: ReactNode, name: string, placeholder?:string, label?: ReactNode, type?: string } & React.HTMLProps<HTMLInputElement>

const Scanner: FC<Props> = ({ icon, name, label, placeholder, type, ...rest }) => {
    return <div className="w-full">
        {label && <Label htmlFor={name} className="uppercase text-sm font-semibold text-gray-600">{ label }</Label>}
        <div className="flex items-center px-3 py-2 space-x-2 border-b-2">
            { icon }
            <input {...rest} id={name} type={type ?? "text"} name={name} placeholder={placeholder ?? undefined} className="text-sm w-full border-none outline-none" />
        </div>
    </div>
}

export default Scanner