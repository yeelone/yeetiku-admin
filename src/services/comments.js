import { request, config } from '../utils'
const { api } = config
const { comments } = api

export async function query (params) {
  return request({
    url: comments + '/all',
    method: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: comments,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: comments , 
    method: 'delete',
    data: params,
  })
}