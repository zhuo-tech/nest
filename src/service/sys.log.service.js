import {cloud} from "@/cloud.js"
import qs from 'qs'

export async function fetchList(query) {
    const param = qs.parse(query)
    console.debug('Log[fetchList] query ->', param)
    const res = await cloud.invokeFunction(
        'sys-log-page',
        param
    )
    console.debug('Log[fetchList] res ->', res)
    return res
}

export async function delObjs() {
    const res = await cloud.invokeFunction(
        'sys-log-delete',
        {}
    )
    return res
}
