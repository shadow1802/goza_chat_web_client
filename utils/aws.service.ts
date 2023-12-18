import AWS from 'aws-sdk'

type Process = {
    loaded: number;
    total: number;
}

class Uploader {
    client: AWS.S3

    constructor() {
        this.client = new AWS.S3({
            endpoint: `https://sgp1.digitaloceanspaces.com`,
            region: `sgp1`,
            credentials: {
                accessKeyId: `DO00D8CQ4MA2EQKTMNYQ`,
                secretAccessKey: `GTsDEYSqYXWDbIEIYxsRWgoYWNIl4t/dR9EZBYjmz2I`
            }
        })
    }

    async uploader (file: AWS.S3.PutObjectRequest, callback?: (process: Process) => void) {
        const res = await this.client.putObject(file).on("httpUploadProgress", (process) => {
            callback && callback(process)
        }).send((err, data) => { err && console.log(err) })
    }
}

const UploadService = new Uploader()
export default UploadService
