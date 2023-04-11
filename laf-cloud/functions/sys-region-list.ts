import cloud from '@lafjs/cloud'

const DB = cloud.database()
const DB_NAME = {
  SYS_REGION: 'sys_region'
}

export async function main(ctx: FunctionContext) {
  const { code } = ctx.query
  let parent = '0'
  if (code) {
    parent = code
  }
  const { data } = await DB
    .collection(DB_NAME.SYS_REGION)
    .where({
      parent: parent
    })
    .get()
  return R.ok(data)
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