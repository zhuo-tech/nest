import {cloud} from "@/cloud"

const DB = cloud.database()
const DB_NAME = {
    MC_CATEGORY: 'mc_category'
}

export async function fetchTree(query) {
    console.debug('Category[fetchTree] request query->', query)
    const qo = {}
    if (query && query.categoryNme) {
        qo.name = new RegExp(`.*${query.categoryNme}.*`)
    }
    const {data, ok} = await DB.collection(DB_NAME.MC_CATEGORY)
        .where(qo)
        .orderBy('sortOrder', 'asc')
        .get()
    const tree = buildTree(data)
    const res = {
        data: tree,
        success: ok
    }
    console.debug('Category[fetchTree] res->', res)
    return res
}

export async function addObj(obj) {
    console.log('Category[addObj] request param obj->', obj)
    const o = {
        ...obj,
        updateTime: Date.now(),
        createTime: Date.now()
    }
    const res = await DB.collection(DB_NAME.MC_CATEGORY)
        .add(o)
    console.log('Category[addObj] response result->', res)
}

/**
 * 根据ID 查询部门信息
 * @param id 主键
 */
export async function getObj(id) {
    console.log('Category[getObj] request param ID->', id)
    const res = await DB.collection(DB_NAME.MC_CATEGORY).where({
        _id: id
    }).getOne()
    console.log('Category[getObj] response result->', res)
    return res
}

export async function delObj(id) {
    console.log('Category[delObj] request param ID->', id)
    const res = await DB.collection(DB_NAME.MC_CATEGORY).where({
        _id: id
    }).remove()
    console.log('Category[delObj] response result->', res)
    return res
}

export async function putObj(obj) {
    console.debug('Category[putObj] request param obj->', obj)
    const id = obj._id
    const data = {
        ...obj,
        updateTime: Date.now(),
        _id: undefined
    }
    // 不可更新主键
    delete data._id
    const res = await DB.collection(DB_NAME.MC_CATEGORY)
        .doc(id)
        .update(data)
    console.debug('Category[putObj] result->', res)
    return res

}


function buildTree(items) {
    const tree = []
    for (let i = 0; i < items.length; i++) {
        const arr = []
        for (let j = 0; j < items.length; j++) {
            if (items[i]._id === items[j].parentId) {
                items[i].children = arr
                arr.push(items[j])
            }
        }
    }
    for (let i = 0; i < items.length; i++) {
        if (items[i].parentId === '0') {
            tree.push(items[i])
        }
    }
    return tree
}
