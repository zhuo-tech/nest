import { cloud } from "@/cloud"

const DB = cloud.database()
const DB_NAME = {
  SYS_USER: 'sys_user',
  SYS_ROLE: 'sys_role',
  SYS_MENU: 'sys_menu',
  SYS_ROLE_MENU: 'sys_role_menu',
  SYS_USER_ROLE: 'sys_user_role'
}

/**
 * 根据ID查询菜单信息
 * @param id 菜单ID
 * @returns {Promise<*>}
 */
export async function getMenu(id) {
  return await cloud.invokeFunction('sys-user-resource', { id })
}

/**
 * 查询当前用户顶部菜单信息
 * @returns {Promise<*>}
 */
export async function getTopMenu() {
  return await cloud.invokeFunction('sys-user-resource', { type: 'top' })
}

/**
 * 生成菜单树
 * @param params
 */
export async function list() {
  console.debug('Menu[list] request param')
  const { data, ok } = await DB.collection(DB_NAME.SYS_MENU)
    .where({})
    .orderBy('sortOrder', 'asc')
    .get()
  if (data.length === 0) {
    return {
      data: [],
      success: ok
    }
  }
  const tree = buildTree(data)
  const res = {
    data: tree,
    success: ok
  }
  console.debug('生成菜单树 Menu[list] res->', res)
  return res
}

export async function addObj(obj) {
  console.debug('Menu[addObj] request param obj->', obj)
  const data = {
    ...obj,
    createTine: Date.now()
  }
  const res = await DB.collection(DB_NAME.SYS_MENU)
    .add(data)
  console.debug('Menu[addObj] result->', res)
  return res
}

export async function getObj(id) {
  console.debug('Menu[getObj] request param id->', id)
  const res = await DB.collection(DB_NAME.SYS_MENU)
    .where({ _id: id })
    .getOne()
  console.debug('Menu[getObj] result->', res)
  return res
}

export async function delObj(id) {
  console.debug('Menu[delObj] request param id->', id)
  const res = await DB.collection(DB_NAME.SYS_MENU)
    .where({ _id: id })
    .remove()
  console.debug('Menu[delObj] result->', res)
  return res
}

export async function putObj(obj) {
  console.debug('Menu[putObj] request param obj->', obj)
  const id = obj._id
  const data = {
    ...obj,
    updateTime: Date.now(),
    _id: undefined
  }
  // 不可更新主键
  delete data._id
  const res = await DB.collection(DB_NAME.SYS_MENU)
    .doc(id)
    .update(data)
  console.debug('Menu[putObj] result->', res)
  return res
}

function buildTree(permissions) {
  const tree = []
  for (let i = 0; i < permissions.length; i++) {
    const arr = []
    for (let j = 0; j < permissions.length; j++) {
      if (permissions[i]._id === permissions[j].parentId) {
        permissions[i].children = arr
        arr.push(permissions[j])
      }
    }
  }
  for (let i = 0; i < permissions.length; i++) {
    if (permissions[i].parentId === '-1') {
      tree.push(permissions[i])
    }
  }
  return tree
}
