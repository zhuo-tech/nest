import {cloud} from "@/cloud"

const DB = cloud.database()
const DB_NAME = {
    SYS_POST: 'sys_post'
}

export async function listPosts() {
    console.debug('Post[fetchList] request')
    const res = await DB
        .collection(DB_NAME.SYS_POST)
        .get()
    console.debug('列表查询结果: ', res.data)
    const r = {
        data: res.data,
        success: res.ok
    }
    console.debug('Post[fetchList] result->', r)
    return r
}

export async function fetchList(query) {
    console.debug('Post[fetchList] request param query->', query)
    const {current, size} = query
    const res = await DB
        .collection(DB_NAME.SYS_POST)
        .where({})
        .skip(size * (current - 1))
        .limit(size)
        .get()
    const {total} = await DB.collection(DB_NAME.SYS_POST)
        .where({})
        .count()
    console.debug('分页查询结果: ', res.data)
    const r = {
        data: res.data,
        success: res.ok,
        total
    }
    console.debug('Post[fetchList] result->', r)
    return r
}

export async function addObj(obj) {
    console.debug('Post[addObj] request param obj->', obj)
    const o = {
        ...obj,
        createTime: new Date(),
        updateTime: new Date(),
        delFlag: '0'
    }
    const r = await DB.collection(DB_NAME.SYS_POST).add(o)
    console.debug('Post[addObj] result->', r)
    return r
}

export async function getObj(id) {
    return await DB.collection(DB_NAME.SYS_POST)
        .where({_id: id})
        .getOne()
}

export async function delObj(id) {
    console.debug('Post[delObj] request param id->', id)
    const res = await DB.collection(DB_NAME.SYS_POST)
        .where({_id: id})
        .remove()
    console.debug('Post[delObj] result->', res)
    return res
}

export async function putObj(obj) {
    console.debug('Post[putObj] request param obj->', obj)
    const id = obj._id
    const data = {
        ...obj,
        updateTime: new Date(),
        _id: undefined
    }
    // 不可更新主键
    delete data._id
    const res = await DB.collection(DB_NAME.SYS_POST)
        .doc(id)
        .update(data)
    console.debug('Post[putObj] result->', res)
    return res
}
