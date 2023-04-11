import {cloud} from "@/cloud"

const DB = cloud.database()
const COLLECTION = {
    SYS_FILE: 'sys_file'
}

export async function fetchList(query) {
    console.debug('File[fetchList] request param query->', query)
    const {current, size, original, bucketName} = query
    const qo = {}
    if (original) {
        qo.publicName = new RegExp(`.*${original}.*`)
    }
    if (bucketName) {
        qo.bucketName = bucketName
    }
    const res = await DB
        .collection(COLLECTION.SYS_FILE)
        .where(qo)
        .skip(size * (current - 1))
        .limit(size)
        .get()
    const {total} = await DB.collection(COLLECTION.SYS_FILE)
        .where(qo)
        .count()
    console.debug('分页查询结果: ', res.data)
    const r = {
        data: res.data,
        success: res.ok,
        total
    }
    console.debug('File[fetchList] result->', r)
    return r
}

export async function delObj(id) {
    console.debug('File[delObj] request param ID->', id)
    const res = await DB.collection(COLLECTION.SYS_FILE).where({
        _id: id
    }).remove()
    console.debug('File[delObj] response result->', res)
    return res
}
