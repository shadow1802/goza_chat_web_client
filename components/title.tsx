import { Orbitron } from 'next/font/google'
import { FC } from 'react'

const orbitron = Orbitron({ weight: "700", subsets: ['latin'] })

interface Props {
    size?: number
}

const Title: FC<Props> = ({ size }) => {
    return <div className='flex space-x-1 items-center'>
        <p className={orbitron.className} style={{ fontSize: size ?? 22, fontWeight: 600 }}>
            <span className="py-1 rounded-lg bg-sky-500 text-white px-2">GOZA</span> <span className='text-sky-500'>Chat</span>
        </p>
    </div>
}

export default Title