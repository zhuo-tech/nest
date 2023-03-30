import { cloud } from "@/cloud"

const DB = cloud.database()
const DB_NAME = {
  SYS_SOCIAL: 'sys_social'
}

export async function fetchList(query) {
  console.debug('Social[fetchList] request param query->', query)
  const { current, size } = query
  const res = await DB
    .collection(DB_NAME.SYS_SOCIAL)
    .where({})
    .skip(size * (current - 1))
    .limit(size)
    .get()
  const { total } = await DB.collection(DB_NAME.SYS_SOCIAL)
    .where({})
    .count()
  console.debug('分页查询结果: ', res.data)
  const r = {
    data: res.data,
    success: res.ok,
    total
  }
  console.debug('Social[fetchList] result->', r)
  return r
}

export async function addObj(obj) {
  console.log('Social[addObj] request param obj->', obj)
  const o = {
    ...obj,
    updateTime: Date.now(),
    createTime: Date.now()
  }
  const res = await DB.collection(DB_NAME.SYS_SOCIAL)
    .add(o)
  console.log('Social[addObj] response result->', res)
}

export async function getObj(id) {
  return await DB.collection(DB_NAME.SYS_SOCIAL)
    .where({ _id: id })
    .getOne()
}

export async function delObj(id) {
  return await DB.collection(DB_NAME.SYS_SOCIAL).where({
    _id: id
  }).remove()
}

export async function putObj(obj) {
  console.debug('Social[putObj] request param obj->', obj)
  const id = obj._id
  const data = {
    ...obj,
    updateTime: Date.now(),
    _id: undefined
  }
  // 不可更新主键
  delete data._id
  const res = await DB.collection(DB_NAME.SYS_SOCIAL)
    .doc(id)
    .update(data)
  console.debug('Social[putObj] result->', res)
  return res
}
