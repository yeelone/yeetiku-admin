import { request, config } from '../utils'
const { api } = config
const { categories } = api

export async function query (params) {
  return request({
    url: categories,
    method: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: categories,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: categories,
    method: 'delete',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: categories,
    method: 'put',
    data: params,
  })
}
