import { cloud } from "@/cloud"
import { R } from "@/util/R"

const DB = cloud.database()
const DB_NAME = {
  SYS_PARAM: 'sys_param'
}


export async function fetchList(query) {
  console.debug('Param[fetchList] request param query->', query)
  const { current, size, publicName, systemFlag } = query
  const qo = {}
  if (publicName) {
    qo.publicName = new RegExp(`.*${publicName}.*`)
  }
  if (systemFlag) {
    qo.systemFlag = systemFlag
  }
  const res = await DB
    .collection(DB_NAME.SYS_PARAM)
    .where(qo)
    .skip(size * (current - 1))
    .limit(size)
    .get()
  const { total } = await DB.collection(DB_NAME.SYS_PARAM)
    .where(qo)
    .count()
  console.debug('分页查询结果: ', res.data)
  const r = {
    data: res.data,
    success: res.ok,
    total
  }
  console.debug('Param[fetchList] result->', r)
  return r
}

export async function addObj(obj) {
  console.debug('Param[addObj] request param query->', obj)
  const o = {
    ...obj,
    createTime: Date.now(),
    updateTime: Date.now(),
    delFlag: '0'
  }
  const r = await DB.collection(DB_NAME.SYS_PARAM).add(o)
  console.debug('Param[addObj] result->', r)
  return r
}

export async function getObj(key) {
  console.debug('Param[getObj] result->', key)
  const { data: param, ok } = await DB
    .collection(DB_NAME.SYS_PARAM)
    .where({ publicKey: key })
    .getOne()
  if (!param) {
    return {
      data: null,
      success: ok
    }
  }
  console.debug('Param[getObj] result->', param)
  return {
    data: param,
    success: ok
  }
}

export async function delObj(id) {
  console.log('Param[delObj] request param ID->', id)
  const res = await DB.collection(DB_NAME.SYS_PARAM).where({
    _id: id
  }).remove()
  console.log('Param[delObj] response result->', res)
  return res
}

export async function putObj(obj) {
  console.debug('Param[putObj] request param query->', obj)
  const { _id: id, systemFlag } = obj
  const { data: param } = await DB.collection(DB_NAME.SYS_PARAM)
    .where({ _id: id })
    .getOne()
  if (!param) {
    return R.failed("更新的对象不存在")
  }
  if (param.systemFlag === '1' && systemFlag === '0') {
    return R.failed("系统类型不能修改")
  }
  const data = {
    ...obj,
    _id: undefined,
    updateTime: Date.now(),
    delFlag: '0'
  }
  console.debug('Param[putObj] data->', data)
  delete data._id
  const res = await DB.collection(DB_NAME.SYS_PARAM)
    .doc(id)
    .update(data)
  console.debug('Param[putObj] result->', res)
  return R.ok(res.matched)
}
