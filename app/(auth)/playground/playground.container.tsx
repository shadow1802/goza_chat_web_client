"use client"

export default function PlayGroundContainer() {

    const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTcyZDFhYzgzMjM4ZTZkZDQ2MjgyZjQiLCJyb2xlIjoiVVNFUiIsImlzQWN0aXZlIjp0cnVlLCJpYXQiOjE3MDIwNDM3NTJ9.tgi1UO6oj4cvc-fqnyqOJvw9Ds2eXRrHczYSj55Q-uE"

    const onSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault()
        const form = event.currentTarget
        const { file } = form.elements as typeof form.elements & {
            file: { files: FileList }
        }

        // for mutiple uploader:
        const multiple_uploader_data = new FormData()
        for (let x = 0; x < file.files.length; x++) {
            multiple_uploader_data.append("files", file.files[x])
        }
        const multiple_uploader = await fetch("http://localhost:8888/upload/multiple", {
            method: "POST", headers: {
                Authorization: token
            }, body: multiple_uploader_data
        })
        // ---------------------->

        // for single uploader:
        const single_uploader_data = new FormData()
        single_uploader_data.append("file", file.files[0])
        const single_uploader = await fetch("http://localhost:8888/upload/single", {
            method: "POST", headers: {
                Authorization: token
            }, body: single_uploader_data
        })
        // ---------------------->

        const multiple_response = await multiple_uploader.json()
        const single_response = await single_uploader.json()
        console.log(multiple_response, single_response)
    }

    const testSearch = async () => {
        const res = await fetch("http://localhost:8888/user/search?keyword=tung")
        const data = await res.json()
        console.log(data)
    }

    const testStream = async () => {
        const res = await fetch("http://localhost:8888")

        if (res.body) {
            const reader = res.body.getReader()
            const { value, done } = await reader.read()
            if (done) {
                console.log("The stream was already closed!");
            } else {
                console.log(value.toString());
            }
        }
    }

    return <div>
        <form onSubmit={onSubmit}>
            <input type="file" name="file" multiple />
            <button type="submit">OK</button>
        </form>

        <div className="flex flex-col space-y-2">
            <button onClick={testSearch} className="bg-sky-500 text-white">Test Search</button>

            <button onClick={testStream} className="bg-sky-500 text-white">Test Stream</button>

        </div>
    </div>
}