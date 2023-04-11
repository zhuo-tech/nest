import cloud from '@lafjs/cloud'
import {PutObjectCommand, S3} from "@aws-sdk/client-s3";

exports.main = async function (ctx: FunctionContext) {
    const {userId, type} = userDetails(ctx)
    if (!userId) {
        return R.failed('非法请求', 401)
    }
    if (type !== 'admin') {
        return R.failed('非法请求', 401)
    }
    const ENDPOINT = cloud.env.OSS_EXTERNAL_ENDPOINT;
    const bucketName = "cflg6f-nest";
    const s3Client = new S3({
        region: cloud.env.OSS_REGION,
        endpoint: ENDPOINT,
        credentials: {
            accessKeyId: cloud.env.OSS_ACCESS_KEY,
            secretAccessKey: cloud.env.OSS_ACCESS_SECRET,
        },
        forcePathStyle: true,
    });

    const file = ctx.files[0]
    const stream = require('fs').createReadStream(file.path)
    const cmd = new PutObjectCommand({
        Bucket: bucketName,
        Key: file.filename,
        Body: stream,
        ContentType: file.mimetype,
    })
    try {
        const {$metadata: metadata} = await s3Client.send(cmd);
        if (metadata?.httpStatusCode === 200) {
            const doc = {
                fileName: file.filename,
                original: file.originalname,
                bucketName: bucketName,
                type: file.mimetype,
                fileSize: file.size,
                createTime: new Date(),
                updateTime: new Date(),
                delFlag: "0"
            }
            await cloud.database().collection('sys_file').add(doc)
        }
        const data = {
            bucketName: bucketName,
            fileName: file.filename
        }
        return R.ok(data)
    } catch (err) {
        return R.failed(err)
    }
}

function userDetails(ctx: FunctionContext): Partial<UserDetails> {
    const authorization = ctx.headers?.authorization
    if (authorization) {
        const token = authorization.split('Bearer ')[1]
        return cloud.parseToken(token)
    }
    return {}
}

interface UserDetails {
    userId: string
    type: string
    exp: number
}

class R<T> {
    public code: number
    public msg: string
    public data: T

    constructor(code: number, msg: string, data: T) {
        this.code = code
        this.msg = msg
        this.data = data
    }

    public static ok<T = any>(data: T, msg: string = 'success'): R<T> {
        return new R<T>(0, msg, data)
    }

    public static failed(msg: string = 'error', code: number = 1) {
        return new R(code, msg, false)
    }
}
