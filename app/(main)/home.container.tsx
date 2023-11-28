"use client"

import { FC, useEffect } from "react"

type Props = {}

const HomeContainer: FC<Props> = (props) => {

    useEffect(() => {
        alert("Đang làm chức năng gửi thông báo phòng nhé ku Ricon, cái nút hình tờ giấy ở form chat ấy, làm xong thì xóa alert này đi")
    }, [])

    return <div className="bg-gray-200 w-full min-h-full">
        <div className="w-full">
        </div>
    </div>
}

export default HomeContainer
