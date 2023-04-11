import cloud from '@lafjs/cloud'

const DB = cloud.database()
const DB_NAME = {
  SYS_USER: 'sys_user',
  SYS_ROLE: 'sys_role',
  SYS_MENU: 'sys_menu',
  SYS_ROLE_MENU: 'sys_role_menu',
  SYS_USER_ROLE: 'sys_user_role'
}

/**
 * 获取用户信息
 * @param ctx
 */
export async function main(ctx: FunctionContext) {
  const { userId, type } = userDetails(ctx)
  if (!userId) {
    return R.failed('非法请求', 401)
  }
  if (type !== 'admin') {
    return R.failed('非法请求', 401)
  }
  const user = await selectOneByUserId(userId)
  if (!user) {
    return R.failed('非法请求', 401)
  }
  let roles = await selectUserRoleByUserId(userId)
  if (!roles) {
    return R.failed('暂无权限', 401)
  }
  roles = roles.map(
    (role: Role) => role.roleId
  )
  let permissions = await selectUserPermissionByRoleIds(roles)
  if (!permissions) {
    return R.failed('暂无权限', 401)
  }
  permissions = permissions.map(
    (item: Permission) => item.permission
  )
  return R.ok({ user, roles, permissions })
}



async function selectOneByUserId(userId: string) {
  const { data: user } = await DB.collection(DB_NAME.SYS_USER)
    .where({ _id: userId })
    .getOne()
  return user
}

async function selectUserPermissionByRoleIds(roleIds: string[]) {
  const cmd = DB.command
  const { data: rolePermissions } = await DB.collection(DB_NAME.SYS_ROLE_MENU)
    .where({ roleId: cmd.in(roleIds) })
    .get()
  const menuIds = rolePermissions.map(
    (menu: Menu) => menu.menuId
  )
  const { data: permissions } = await DB.collection(DB_NAME.SYS_MENU)
    .where({ _id: cmd.in(menuIds) })
    .get()
  const codes = permissions.filter(item => {
    if (item.permission) {
      return item.permission
    }
  })
  return codes
}

async function selectUserRoleByUserId(userId: string) {
  const { data: roles } = await DB.collection(DB_NAME.SYS_USER_ROLE)
    .where({ userId: userId })
    .get()
  return roles
}

function userDetails(ctx: FunctionContext): Partial<UserDetails> {
  const authorization = ctx.headers?.authorization
  if (authorization) {
    const token = authorization.split('Bearer ')[1]
    return cloud.parseToken(token)
  }
  return {}
}


interface Permission {
  permission: string
}

interface Role {
  roleId: string
}

interface Menu {
  menuId: string
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
