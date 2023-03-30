import qs from 'qs'
import { cloud } from "@/cloud.js"

export const loginByUsername = async(username, password) => {
  const param = qs.parse({ username: username, password: password })
  const res = await cloud.invokeFunction(
    'sys-user-login',
    param
  )
  return res
}

export const getUserInfo = async() => {
  return await cloud.invokeFunction('sys-user-info', {})
}

export const logout = async() => {
  return { "code": 0, "msg": 'success', "data": true }
}
