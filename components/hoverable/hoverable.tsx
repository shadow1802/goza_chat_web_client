import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { FC, ReactNode } from "react"

type Props = { children: ReactNode, content: ReactNode }

const Hoverable: FC<Props> = ({ children, content }) => {
    return <TooltipProvider>
        <Tooltip>
            <TooltipTrigger className="flex flex-col justify-center items-center">
                { children }
            </TooltipTrigger>
            <TooltipContent side="right">
                { content }
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
}

export default Hoverable