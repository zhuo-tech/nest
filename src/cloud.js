import { Cloud, EnvironmentType } from 'laf-client-sdk'
import { getToken } from "@/util/auth"

export const APP_ID = 'cflg6f'
export const API_ENDPOINT = 'https://cflg6f.laf.dev'
export const OSS_ENDPOINT = 'https://cflg6f-nest.oss.laf.dev'

export const cloud = new Cloud({
  baseUrl: API_ENDPOINT,
  dbProxyUrl: '/proxy/admin',
  environment: EnvironmentType.H5,
  getAccessToken: () => getToken()
})

