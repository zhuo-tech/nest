import {R} from "@/util/R"
import {cloud} from "@/cloud"

const DB = cloud.database()
const CMD = DB.command
const COLLECTION = {
    SYS_DICT: 'sys_dict'
}

export async function fetchList(query) {
    console.debug('Dict[fetchList] request param query->', query)
    const {current, size, dictType, systemFlag} = query
    const qo = {}
    if (dictType) {
        qo.dictType = dictType
    }
    if (systemFlag) {
        qo.systemFlag = systemFlag
    }
    const res = await DB
        .collection(COLLECTION.SYS_DICT)
        .where(qo)
        .skip(size * (current - 1))
        .limit(size)
        .get()
    const {total} = await DB.collection(COLLECTION.SYS_DICT)
        .where(qo)
        .count()
    console.debug('分页查询结果: ', res.data)
    const r = {
        data: res.data,
        success: res.ok,
        total
    }
    console.debug('Dict[fetchList] result->', r)
    return r
}

export async function addObj(obj) {
    console.debug('Dict[addObj] request param query->', obj)
    const o = {
        ...obj,
        createTime: Date.now(),
        updateTime: Date.now(),
        delFlag: '0',
        records: []
    }
    const r = await DB.collection(COLLECTION.SYS_DICT).add(o)
    console.debug('Dict[addObj] result->', r)
    return r
}

export async function getObj(id) {
    console.debug('Dict[getObj] request param ID->', id)
    const res = await DB.collection(COLLECTION.SYS_DICT).where({
        _id: id
    }).getOne()
    console.debug('Dict[getObj] response result->', res)
    return res
}

export async function delObj(id) {
    console.debug('Dict[delObj] request param ID->', id)
    const res = await DB.collection(COLLECTION.SYS_DICT).where({
        _id: id
    }).remove()
    console.debug('Dict[delObj] response result->', res)
    return res
}

export async function putObj(obj) {
    console.debug('Dict[putObj] request param query->', obj)
    const {_id: id} = obj
    const {data: param} = await DB
        .collection(COLLECTION.SYS_DICT)
        .where({_id: id})
        .getOne()
    if (!param) {
        return R.failed("更新的对象不存在")
    }
    const data = {
        ...obj,
        _id: undefined,
        updateTime: Date.now(),
        delFlag: '0'
    }
    console.debug('Dict[putObj] data->', data)
    delete data._id
    const res = await DB.collection(COLLECTION.SYS_DICT)
        .doc(id)
        .update(data)
    console.debug('Dict[putObj] result->', res)
    return R.ok(res.matched)
}

export async function fetchItemList(query) {
    console.debug('Dict[fetchItemList] request param query->', query)
    const {dictId} = query
    const {data: dict, ok} = await DB
        .collection(COLLECTION.SYS_DICT)
        .where({_id: dictId})
        .getOne()
    if (!dict.records && dict.records.length === 0) {
        return {
            data: [],
            success: ok
        }
    }
    const r = {
        data: dict.records,
        success: ok
    }
    console.debug('Dict[fetchItemList] result->', r)
    return r
}

export async function addItemObj(obj) {
    console.debug('Dict[addItemObj] request param obj->', obj)
    const {dictId} = obj
    const {data: dict} = await DB.collection(COLLECTION.SYS_DICT)
        .where({_id: dictId})
        .getOne()
    if (!dict) {
        return R.failed("操作的对象不存在")
    }
    const doc = {
        ...obj,
        _id: DB.ObjectId().toHexString(),
        delFlag: "0",
        updateTime: Date.now(),
        createTime: Date.now()
    }
    const res = await DB
        .collection(COLLECTION.SYS_DICT)
        .doc(dictId)
        .update({
            records: CMD.push(doc)
        })
    console.debug('Dict[addItemObj] res->', res)
}

export async function delItemObj(dictId, id, dictType) {
    console.debug('Dict[delItemObj] request param dictId id->', dictId, id)
    const res = await DB
        .collection(COLLECTION.SYS_DICT)
        .where({_id: dictId}
        )
        .update({
            $pull: {
                _id: id,
                dictId: dictId,
                dictType: dictType
            }
        })
    console.debug('Dict[delItemObj] res->', res)
}

export async function putItemObj(obj) {
    console.debug('Dict[putItemObj] request param query->', obj)
    const {dictId, _id: itemId} = obj
    const {data: dict} = await DB.collection(COLLECTION.SYS_DICT)
        .where({_id: dictId})
        .getOne()
    if (!dict) {
        return R.failed("更新的对象不存在")
    }
    const doc = {...obj, updateTime: Date.now()}
    const res = await DB
        .collection(COLLECTION.SYS_DICT)
        .where(
            {
                _id: dictId,
                records: {
                    _id: itemId
                }
            }
        )
        .update(
            {
                "records.$": doc
            }
        )
    console.debug('Dict[putItemObj] res->', res)
}

export async function remote(type) {
    console.debug('Dict[remote] type->', type)
    const {data: dict, ok} = await DB
        .collection(COLLECTION.SYS_DICT)
        .where({dictType: type})
        .getOne()
    if (!dict) {
        return {
            data: null,
            success: ok
        }
    }
    console.debug('Dict[remote] result->', dict)
    return {
        data: dict,
        success: ok
    }
}


export async function listDictItemByType(type) {
    console.debug('Dict[listDictItemByType] type->', type)
    if (!type) {
        throw new Error('参数不合法')
    }
    const {data, ok} = await DB
        .collection(COLLECTION.SYS_DICT)
        .where({dictType: type})
        .getOne()
    console.debug('Dict[listDictItemByType] data->', data)
    return {
        data: data.records,
        success: ok
    }
}
