import { request, config } from '../utils'
const { api } = config
const { feedback } = api


export async function query (params) {
  return request({
    url: feedback,
    method: 'get',
    data: params,
  })
}