import colorGenerator from "@/utils/colorGenerator.service";
import signName from "@/utils/signName.service";
import { FC } from "react";

type Props = { src?: string, name: string, className?: string }

const Avatar: FC<Props> = ({ src, className, name }) => {
    return <>
        {src ? <img className={className} src={src} />
        : <div className={className} style={{
            display: "flex", 
            alignItems: "center",
            justifyContent: "center",
            borderRadius:"100%", 
            backgroundColor: colorGenerator(name)
        }}>
            <p className="text-white text-sm font-semibold">{signName(name)}</p>
        </div>}
    </>
}

export default Avatar