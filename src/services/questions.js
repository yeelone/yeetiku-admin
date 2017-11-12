import { request , config  } from '../utils'
const { api } = config
const { questions,notification } = api

export async function queryByID(params) {
  return request({
    url: questions + "/" + params.id ,
    method: 'get',
  })
}

export async function query (params) {
  return request({
    url: questions,
    method: 'get',
    data: params,
  })
}

export async function queryImportResult(params){
  return request({
    url:notification + '/users/' + params.userID + '/questions/import/',
    method:'get',
    data:params,
  })
}

export async function removeImportResult(params){
  return request({
    url:notification + '/users/' + params.userID + '/questions/import/',
    method:'delete',
  })
}


export async function changeCategory(params){
  return request({
    url:questions + "/" + params.id + "/category", 
    method:'put',
    data:params
  })
}

export async function create (params) {
  return request({
    url: questions,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: questions ,
    method: 'delete',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: questions ,
    method: 'put',
    data: params,
  })
}
