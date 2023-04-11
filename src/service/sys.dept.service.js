import {cloud} from "@/cloud"

const DB = cloud.database()
const COLLECTION = {
    SYS_DEPT: 'sys_dept'
}

export async function fetchTree(query) {
    console.debug('Dept[fetchTree] request query->', query)
    const qo = {}
    if (query && query.deptName) {
        qo.name = new RegExp(`.*${query.deptName}.*`)
    }
    const {data, ok} = await DB.collection(COLLECTION.SYS_DEPT)
        .orderBy('sortOrder', 'asc')
        .where(qo)
        .get()
    const tree = buildTree(data)
    const res = {
        data: tree,
        success: ok
    }
    console.debug('Dept[fetchTree] res->', res)
    return res
}

export async function addObj(obj) {
    console.log('Dept[addObj] request param obj->', obj)
    const o = {
        ...obj,
        updateTime: Date.now(),
        createTime: Date.now()
    }
    const res = await DB.collection(COLLECTION.SYS_DEPT)
        .add(o)
    console.log('Dept[addObj] response result->', res)
}

/**
 * 根据ID 查询部门信息
 * @param id 主键
 */
export async function getObj(id) {
    console.log('Dept[getObj] request param ID->', id)
    const res = await DB.collection(COLLECTION.SYS_DEPT).where({
        _id: id
    }).getOne()
    console.log('Dept[getObj] response result->', res)
    return res
}

export async function delObj(id) {
    console.log('Dept[delObj] request param ID->', id)
    const res = await DB.collection(COLLECTION.SYS_DEPT).where({
        _id: id
    }).remove()
    console.log('Dept[delObj] response result->', res)
    return res
}

export async function putObj(obj) {
    console.debug('Dept[putObj] request param obj->', obj)
    const id = obj._id
    const data = {
        ...obj,
        updateTime: Date.now(),
        _id: undefined
    }
    // 不可更新主键
    delete data._id
    const res = await DB.collection(COLLECTION.SYS_DEPT)
        .doc(id)
        .update(data)
    console.debug('Dept[putObj] result->', res)
    return res

}


function buildTree(deptList) {
    const tree = []
    for (let i = 0; i < deptList.length; i++) {
        const arr = []
        for (let j = 0; j < deptList.length; j++) {
            if (deptList[i]._id === deptList[j].parentId) {
                deptList[i].children = arr
                arr.push(deptList[j])
            }
        }
    }
    for (let i = 0; i < deptList.length; i++) {
        if (deptList[i].parentId === '0') {
            tree.push(deptList[i])
        }
    }
    return tree
}
