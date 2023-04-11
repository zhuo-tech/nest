import cloud from '@lafjs/cloud'

const DB = cloud.database()
const DB_NAME = {
    SYS_LOG: '__function_logs__'
}
const cmd = DB.command
export async function main(ctx: FunctionContext) {
    console.debug('Log[fetchList] body->', ctx.body)
    const { userId, type } = userDetails(ctx)
    if (!userId) {
        return R.failed('非法请求', 401)
    }
    if (type !== 'admin') {
        return R.failed('非法请求', 401)
    }
    const { current = 1, size = 10, created_at } = ctx.body
    let query = {}
    if (created_at && created_at.length > 0) {
        const start = new Date(created_at[0])
        const end = new Date(created_at[1])
        console.log(start, end)
        query = {
            created_at: cmd.gte(start).and(cmd.lt(end))
        }
    }
    const res = await DB
        .collection(DB_NAME.SYS_LOG)
        .where(query)
        .skip(size * (current - 1))
        .limit(size)
        .orderBy("created_at", "desc")
        .get()
    const { total } = await DB.collection(DB_NAME.SYS_LOG)
        .where(query)
        .count()
    console.debug('分页查询结果: ', res.data)
    const r = {
        data: res.data,
        success: res.ok,
        total
    }
    console.debug('Log[fetchList] result->', r)
    return r
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