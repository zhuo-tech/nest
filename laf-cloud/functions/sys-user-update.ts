import cloud from '@lafjs/cloud'
import * as crypto from 'crypto'

const DB = cloud.database()
const DB_NAME = {
    SYS_USER: 'sys_user',
    SYS_USER_ROLE: 'sys_user_role',
    SYS_USER_POST: 'sys_user_post'
}

export async function main(ctx: FunctionContext) {
    const {userId, type} = userDetails(ctx)
    if (!userId) {
        return R.failed('非法请求', 401)
    }
    if (type !== 'admin') {
        return R.failed('非法请求', 401)
    }
    const {
        _id,
        deptId,
        password,
        phone,
        avatar,
        nickname,
        name,
        email,
        idNumber,
        role,
        post
    } = ctx.body

    if (!_id) {
        return R.failed('参数不合法', 400)
    }
    let user = {}
    if (password) {
        user = {
            deptId,
            password: PasswordTool.encrypt('sha256', password),
            phone,
            avatar,
            nickname,
            name,
            email,
            idNumber,
            update_time: Date.now()
        }
    } else {
        user = {
            deptId,
            phone,
            avatar,
            nickname,
            name,
            email,
            idNumber,
            update_time: Date.now()
        }
    }
    // 移除用户角色
    await removeUserRoleByUserId(_id)

    // 移除用户岗位
    await removeUserPostByUserId(_id)

    // 更新用户信息
    await DB.collection(DB_NAME.SYS_USER)
        .where({_id})
        .update(user)

    // 维护用户角色
    await insertUserRoleByUserId(_id, role)
    // 维护用户岗位
    await insertUserPostByUserId(_id, post)

    return R.ok(true)
}

async function insertUserPostByUserId(userId: string | number, postIds: string[]) {
    for (const postId of postIds) {
        await DB.collection(DB_NAME.SYS_USER_POST).add({
            userId,
            postId
        })
    }
}

async function insertUserRoleByUserId(userId: string | number, roleIds: string[]) {
    for (const roleId of roleIds) {
        await DB.collection(DB_NAME.SYS_USER_ROLE).add({
            userId,
            roleId
        })
    }
}

async function removeUserPostByUserId(userId: string) {
    await DB.collection(DB_NAME.SYS_USER_POST)
        .where({userId: userId})
        .remove()
}

async function removeUserRoleByUserId(userId: string) {
    await DB.collection(DB_NAME.SYS_USER_ROLE)
        .where({userId: userId})
        .remove()
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

    /**
     * 加密
     */
    public static encrypt(type: keyof typeof PasswordTool.encryptionMapping, password: string) {
        const fun = this.encryptionMapping[type]
        if (!fun) {
            throw new Error('未知类型: ' + type)
        }
        return `{${type}}` + fun?.(password)
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
        return new R(code, msg, false)
    }
}
