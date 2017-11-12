import { request, config } from '../utils'
const { api } = config
const { tags } = api

export async function query (params) {
  return request({
    url: tags,
    method: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: tags,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: tags,
    method: 'delete',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: tags,
    method: 'put',
    data: params,
  })
}
