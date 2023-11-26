"use client"
import useAuthValue from "./useAuthValue"
import axios, { AxiosProgressEvent } from "axios"

const useUploader = () => {

    const auth = useAuthValue()

    const video = async (body: FormData, onUpload:(event: AxiosProgressEvent) => void) => {
        const { data } = await axios.post("https://api-chat.luongson.me/api/upload/uploadVideo", body, {
            headers: {
                Authorization: `Bearer ${auth?.token ?? null}`,
                "Content-Type": "multipart/form-data",
            },
            onUploadProgress: onUpload,
        })
        return data
    }

    const image = async (body: FormData, onUpload:(event: AxiosProgressEvent) => void) => {
        const { data } = await axios.post("https://api-chat.luongson.me/api/upload/uploadImage", body, {
            headers: {
                Authorization: `Bearer ${auth?.token ?? null}`,
                "Content-Type": "multipart/form-data",
            },
            onUploadProgress: onUpload,
        })
        return data
    }

    return { image, video }
}

export default useUploader