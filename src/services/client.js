import { request, config } from '../utils'
const { api } = config
const { client } = api

export async function saveConfig (params) {
  return request({
    url: client + "/config",
    method: 'post',
    data: params,
  })
}

export async function getConfig (params) {
  return request({
    url: client + "/config",
    method: 'get',
  })
}
