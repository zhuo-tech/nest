import cloud from '@lafjs/cloud'

const DB = cloud.database()
const DB_NAME = {
    SYS_MENU: 'sys_menu',
    SYS_ROLE: 'sys_role',
    SYS_ROLE_MENU: 'sys_role_menu',
    SYS_USER: 'sys_user'
}

export async function main(ctx: FunctionContext) {
    return '初始化完成'
}