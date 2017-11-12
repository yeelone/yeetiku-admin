import { request, config } from '../utils'
const { api } = config
const { groups } = api

export async function query (params) {
  return request({
    url: groups,
    method: 'get',
    data: params,
  })
}

export async function queryRelatedUsers (params) {
  return request({
    url: groups + "/" + params.id + "/users",
    method: 'get',
  })
}

export async function create (params) {
  return request({
    url: groups,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: groups,
    method: 'delete',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: groups,
    method: 'put',
    data: params,
  })
}

export async function addUsers(params){
  return request({
    url :groups + "/" + params.id + "/users", 
    method: 'post',
    data: { users:params.users }
  })
}
