import {cloud} from "@/cloud"
import {R} from "@/util/R";

const DB = cloud.database()
const COLLECTION = {
    SYS_REGION: 'sys_region'
}

export async function fetchTree(query) {
    const qo = {}
    if (query && query.regionName) {
        qo.label = new RegExp(`.*${query.regionName}.*`)
    }

    const {total} = await DB
        .collection(COLLECTION.SYS_REGION)
        .where(qo)
        .count()

    let all = []
    let current = 0
    let size = 1000
    do {
        current++
        const {data} = await DB
            .collection(COLLECTION.SYS_REGION)
            .where(qo)
            .skip(size * (current - 1))
            .limit(size)
            .get()
        if (data.length === 0) {
            break
        }
        all.push(...data)
    } while (all.length < total)
    const tree = buildTree(all)
    return R.ok(tree)
}


export async function delObj(id) {
    console.log('Region[delObj] request param ID->', id)
    const {deleted} = await DB.collection(COLLECTION.SYS_REGION).where({
        _id: id
    }).remove()
    console.log('Region[delObj] response deleted->', deleted)
    return R.ok(deleted)
}

function buildTree(regionList) {
    const tree = []
    for (let i = 0; i < regionList.length; i++) {
        const arr = []
        for (let j = 0; j < regionList.length; j++) {
            if (regionList[i].code === regionList[j].parent) {
                regionList[i].children = arr
                arr.push(regionList[j])
            }
        }
    }
    for (let i = 0; i < regionList.length; i++) {
        if (regionList[i].parent === '0') {
            tree.push(regionList[i])
        }
    }
    return tree
}
