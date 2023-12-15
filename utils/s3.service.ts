import { PutObjectCommand, PutObjectCommandInput, S3Client } from '@aws-sdk/client-s3';
type user_id = string
class S3 {

    client: S3Client

    constructor() {
        this.client = new S3Client({
            endpoint: `https://sgp1.digitaloceanspaces.com`,
            forcePathStyle: false,
            region: `sgp1`,
            credentials: {
                accessKeyId: `DO00D8CQ4MA2EQKTMNYQ`,
                secretAccessKey: `GTsDEYSqYXWDbIEIYxsRWgoYWNIl4t/dR9EZBYjmz2I`
            },
        })
    }

    async uploader(input: PutObjectCommandInput, owner?: user_id) {
        try {
            const data = await this.client.send(new PutObjectCommand({
                ...input,
                ...(!!owner && { Tagging:`Owner=UserId` })
            }))
            return data
        } catch (error: any) {
            console.log("Error", error);
        }
    }

    async getList(params: { Bucket: string, Prefix: string }) {
        
    }

    async imageLoader(url: string) {
        const img = new Image();
        img.src = url;
        img.onload = () => { img.height, img.width }
        return { height: img.height, width: img.width }
    }
}

const UploadService = new S3()
export default UploadService