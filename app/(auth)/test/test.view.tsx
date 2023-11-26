"use client"

import Peer from "peerjs"
import { useEffect } from "react"

export default function TestView() {

    useEffect(() => {
        const peer = new Peer("traidatnaylacuachungminhquabongxanhbaygiuatroixanh", {
            config: {
                'iceServers': [
                    { url: 'stun:stun.l.google.com:19302' },
                ]
            }
        })

        peer.on("call", async (call) => {
            const localStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true })
            call.answer(localStream)
            call.on("stream", remoteStream => {
                console.log("khi nhan duoc cuoc goi", remoteStream)
                alert("nhan cuoc goi")
            })
        })
    }, [])

    return <div>
        <p>Hello world</p>
    </div>
}