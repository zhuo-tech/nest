import {cloud} from "@/cloud"

const DB = cloud.database()
const DB_NAME = {
    SYS_ROLE: 'sys_role',
    SYS_MENU: 'sys_menu',
    SYS_ROLE_MENU: 'sys_role_menu',
    SYS_USER_ROLE: 'sys_user_role'
}

export async function fetchList(query) {
    console.debug('Role[fetchList] request param query->', query)
    const {current, size} = query
    const res = await DB
        .collection(DB_NAME.SYS_ROLE)
        .where({})
        .skip(size * (current - 1))
        .limit(size)
        .get()
    const {total} = await DB.collection(DB_NAME.SYS_ROLE)
        .where({})
        .count()
    console.debug('分页查询结果: ', res.data)
    const r = {
        data: res.data,
        success: res.ok,
        total
    }
    console.debug('Role[fetchList] result->', r)
    return r
}

export async function deptRoleList() {
    console.debug('Role[roleList]')
    const res = await DB.collection(DB_NAME.SYS_ROLE).get()
    console.debug('Role[roleList] result->', res)
    return res
}

export async function getObj(id) {
    return await DB.collection(DB_NAME.SYS_ROLE)
        .where({_id: id})
        .getOne()
}

export async function getObjByCode(code) {
    return await DB.collection(DB_NAME.SYS_ROLE)
        .where({roleCode: code})
        .getOne()
}

export async function addObj(obj) {
    console.debug('Role[addObj] request param query->', obj)
    const o = {
        ...obj,
        createTime: Date.now(),
        updateTime: Date.now(),
        delFlag: '0'
    }
    const r = await DB.collection(DB_NAME.SYS_ROLE).add(o)
    console.debug('Role[addObj] result->', r)
}

export async function putObj(obj) {
    console.debug('Role[putObj] request param query->', obj)
    const id = obj._id
    const data = {
        ...obj,
        _id: undefined,
        updateTime: Date.now(),
        delFlag: '0'
    }
    delete data.$index
    delete data.$cellEdit
    delete data.$dsType
    console.debug('Role[putObj] data->', data)
    delete data._id
    const r = await DB.collection(DB_NAME.SYS_ROLE)
        .doc(id)
        .update(data)
    console.debug('Role[putObj] result->', r)
}

export async function delObj(id) {
    console.log('Role[delObj] request param ID->', id)
    // remove roleMenu
    await DB.collection(DB_NAME.SYS_ROLE_MENU)
        .where({roleId: id})
        .remove({multi: true})
    // remove userRole
    await DB.collection(DB_NAME.SYS_USER_ROLE)
        .where({roleId: id})
        .remove({multi: true})

    // remove role
    const res = await DB.collection(DB_NAME.SYS_ROLE).where({
        _id: id
    }).remove()

    console.log('Role[delObj] response result->', res)
    return res
}

export async function permissionUpd(roleId, menuIds) {
    const role = DB.collection(DB_NAME.SYS_ROLE)
        .where({_id: roleId})
        .getOne()
    if (!role) {
        throw new Error("[role not found roleId]" + roleId)
    }
    const {ok, error} = await DB.collection(DB_NAME.SYS_ROLE_MENU)
        .where({roleId: roleId})
        .remove({multi: true})
    if (!ok) {
        throw new Error("[remove menus by role error]" + error)
    }
    const roleMenus = menuIds.split(",").map((menuId) => {
        return {roleId, menuId}
    })
    await DB.collection(DB_NAME.SYS_ROLE_MENU)
        .add(roleMenus, {multi: true})
}

export async function fetchMenuIdsByRoleId(roleId) {
    const role = DB.collection(DB_NAME.SYS_ROLE).where({_id: roleId}).getOne()
    if (!role) {
        throw new Error("role not found")
    }
    const cmd = DB.command
    const {data: rolePermissions} = await DB.collection(DB_NAME.SYS_ROLE_MENU)
        .where({roleId: roleId})
        .get()
    const menuIds = rolePermissions.map((menu) => {
        return menu.menuId
    })
    const {data, ok} = await DB.collection(DB_NAME.SYS_MENU)
        .where({_id: cmd.in(menuIds)})
        .get()
    if (data.length === 0) {
        return []
    }
    const r = {
        data: data.map(item => item._id),
        success: ok
    }
    return r
}
