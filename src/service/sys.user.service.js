import {cloud} from "@/cloud"
import qs from 'qs'
import {R} from "@/util/R";
import request from '@/router/axios'

const DB = cloud.database()
const CMD = DB.command
const COLLECTION = {
    SYS_USER: 'sys_user',
    SYS_ROLE: 'sys_role',
    SYS_DEPT: 'sys_dept',
    SYS_POST: 'sys_post',
    SYS_USER_ROLE: 'sys_user_role',
    SYS_USER_POST: 'sys_user_post'
}

export async function fetchList(query) {
    console.debug('User[fetchList] request param query->', query)
    const {current, size, username, deptId} = query
    const qo = {}
    if (username) {
        qo.username = username
    }
    if (deptId) {
        qo.deptId = deptId
    }
    const {data: users, ok} = await DB
        .collection(COLLECTION.SYS_USER)
        .withOne({
            query: DB.collection(COLLECTION.SYS_DEPT),
            localField: "deptId",
            foreignField: "_id",
            as: "dept"
        })
        .where(qo)
        .skip(size * (current - 1))
        .limit(size)
        .get()
    if (!users && users.length === 0) {
        return {
            data: [],
            success: ok,
            total: 0
        }
    }
    const {total} = await DB
        .collection(COLLECTION.SYS_USER)
        .where(qo)
        .count()
    const data = await getUserAttrs(users)
    const r = {
        data: data,
        success: ok,
        total
    }
    console.debug('User[fetchList] result->', r)
    return r
}


export async function addObj(obj) {
    console.debug('User[addObj] obj->', obj)
    const res = await cloud.invokeFunction('sys-user-create', obj)
    console.debug('User[addObj] res->', res)
    return res
}

export async function getObj(id) {
    const {data: user, ok} = await DB
        .collection(COLLECTION.SYS_USER)
        .withOne({
            query: DB.collection(COLLECTION.SYS_DEPT),
            localField: "deptId",
            foreignField: "_id",
            as: "dept"
        })
        .where({_id: id})
        .getOne()
    if (!user) {
        return {
            data: {},
            success: ok,
            total: 0
        }
    }
    // build userRoles
    const {data: userRoles} = await DB
        .collection(COLLECTION.SYS_USER_ROLE)
        .where({userId: user._id})
        .get()
    if (userRoles) {
        const {data: roles} = await DB
            .collection(COLLECTION.SYS_ROLE)
            .where({_id: CMD.in(userRoles.map(({roleId}) => roleId))})
            .get()
        user.roleList = roles
    }

    // build userPosts
    const {data: userPosts} = await DB
        .collection(COLLECTION.SYS_USER_POST)
        .where({userId: user._id})
        .get()
    if (userPosts) {
        const {data: posts} = await DB
            .collection(COLLECTION.SYS_POST)
            .where({_id: CMD.in(userPosts.map(({postId}) => postId))})
            .get()
        user.postList = posts
    }
    return {
        data: user,
        success: ok
    }
}

export async function delObj(id) {
    console.debug('User[delObj] id->', id)
    // 移除用户角色
    await DB.collection(COLLECTION.SYS_USER_ROLE)
        .where({userId: id})
        .remove()
    // 移除用户岗位
    await DB.collection(COLLECTION.SYS_USER_POST)
        .where({userId: id})
        .remove()

    // 移除用户
    const res = await DB.collection(COLLECTION.SYS_USER)
        .where({_id: id})
        .remove()
    console.debug('User[delObj] result->', res)
    return res
}

export async function putObj(obj) {
    console.debug('User[putObj] obj->', obj)
    const res = await cloud.invokeFunction('sys-user-update', obj)
    console.debug('User[putObj] res->', res)
    return res
}

export async function getDetails(username) {
    console.debug('User[getDetails] username->', username)
    const {data: user, ok} = await DB
        .collection(COLLECTION.SYS_USER)
        .where({username: username})
        .getOne()
    if (!user) {
        return {
            data: null,
            success: ok
        }
    }
    console.debug('User[getDetails] result->', user)
    return {
        data: user,
        success: ok
    }
}


export async function getDetailsByPhone(phone) {
    console.debug('User[getDetailsByPhone] phone->', phone)
    const {data: user, ok} = await DB
        .collection(COLLECTION.SYS_USER)
        .where({phone: phone})
        .getOne()
    if (!user) {
        return {
            data: null,
            success: ok
        }
    }
    console.debug('User[getDetailsByPhone] result->', user)
    return {
        data: user,
        success: ok
    }
}

export async function editInfo(obj) {
    console.debug('User[editInfo] obj->', obj)
    const res = await cloud.invokeFunction('sys-user-edit', obj)
    console.debug('User[editInfo] res->', res)
    return res
}

/**
 * 用户附属信息
 * @param users 用户列表信息
 * @returns {Promise<*>}
 */
async function getUserAttrs(users) {
    for (const user of users) {
        // build userRoles
        const {data: userRoles} = await DB.collection(COLLECTION.SYS_USER_ROLE)
            .where({userId: user._id})
            .get()
        if (userRoles) {
            const roleIds = userRoles.map(({roleId}) => roleId)
            const {data: roles} = await DB.collection(COLLECTION.SYS_ROLE)
                .where({_id: CMD.in(roleIds)})
                .get()
            user.roleList = roles
        }

        // build userPosts
        const {data: userPosts} = await DB.collection(COLLECTION.SYS_USER_POST)
            .where({userId: user._id})
            .get()
        if (userPosts) {
            const postIds = userPosts.map(({postId}) => postId)
            const {data: posts} = await DB.collection(COLLECTION.SYS_POST)
                .where({_id: CMD.in(postIds)})
                .get()
            user.postList = posts
        }
    }
    return users
}

export const getUserInfo = () => {
    return request({
        url: '/func/sys-user-info',
        method: 'GET',
    });
}


export const loginByUsername = (username, password) => {
    const data = qs.parse({username: username, password: password})
    return request({
        url: '/func/sys-user-login',
        method: 'POST',
        data: data
    });
}

export const logout = async () => {
    return R.ok(true)
}
