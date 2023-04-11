import cloud from '@lafjs/cloud'
import * as crypto from 'crypto'

const DB = cloud.database()

const DB_NAME = {
    SYS_USER: 'sys_user',
}

interface UserDetails {
    userId: string
    type: string
    exp: number
}

export async function main(ctx: FunctionContext) {
    const {username, password} = ctx.body
    if (!username || !password) {
        return R.failed('参数不合法')
    }
    const {data: user} = await DB.collection(DB_NAME.SYS_USER)
        .where({username})
        .getOne()
    if (!user) {
        console.log('用户名密码错误: ', username)
        return R.failed('用户名密码错误')
    }
    console.log(user.password)
    if (!PasswordTool.check(password, user.password)) {
        console.log('密码错误')
        return R.failed('用户名或密码错误')
    }
    // 签发 token
    const token = new JwtToken(user._id, 'admin')

    return R.ok(token.view())
}

class JwtToken {
    public readonly payload: UserDetails

    constructor(uid: string, type: string) {
        this.payload = JwtToken.getPayload(uid, type)
    }

    private static get expire() {
        return Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7
    }

    public get accessToken(): string {
        // @ts-ignore
        return cloud.getToken(this.payload)
    }

    private static getPayload(uid: string, type: string): UserDetails {
        return {userId: uid, type: type, exp: JwtToken.expire}
    }

    public view() {
        return {...this.payload, access_token: this.accessToken}
    }

}

class PasswordTool {
    /**
     * 加密方式映射
     * - key: 加密方式, 保存在密码头中
     * - value: 加密字符串的方法
     */
    private static readonly encryptionMapping = {
        /**
         * 明文: "{none}"
         */
        none: (s: string) => s,
        /**
         * 哈希: "{sha256}"
         */
        sha256: (s: string) => crypto.createHash('sha256').update(s).digest('hex'),
    }
    /**
     * 密码格式: [{加密方式}]<非空字符密文>
     */
    private static readonly encryption = new RegExp('^(\\{([\\dA-Za-z]+)})?(\\S+)$')

    /**
     * 检查密码
     * @param password 客户端提供未加密密码
     * @param ciphertext 数据库保存的加密后的密码
     */
    public static check(password: string, ciphertext: string) {
        const arr = this.encryption.exec(ciphertext)
        // 密码格式不正确
        if (!arr) {
            return false
        }

        const type: keyof typeof PasswordTool.encryptionMapping = (arr[2] ?? 'sha256') as any
        const cipher = arr[3]

        // 如果找不到合适的加密函数, 表达式应为: undefined === cipher
        return this.encryptionMapping[type]?.(password) === cipher
    }
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
        return new R(code, msg, null)
    }
}
