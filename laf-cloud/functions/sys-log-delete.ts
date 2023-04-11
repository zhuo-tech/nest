import cloud from '@lafjs/cloud'


const DB = cloud.database()
const DB_NAME = {
  SYS_LOG: '__function_logs__'
}

export async function main(ctx: FunctionContext) {
  const { userId, type } = userDetails(ctx)
  if (!userId) {
    return R.failed('非法请求', 401)
  }
  if (type !== 'admin') {
    return R.failed('非法请求', 401)
  }
  const res = await DB
    .collection(DB_NAME.SYS_LOG)
    .where({})
    .remove({ multi: true })
  return R.ok(res.deleted)
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