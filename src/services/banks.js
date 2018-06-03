import { request, config } from '../utils'
const { api } = config
const { banks } = api

export async function queryByID(params) {
  return request({
    url: banks + "/" + params.id ,
    method: 'get',
  })
}

export async function query (params) {
  return request({
    url: 'admin/'+banks,
    method: 'get',
    data: params,
  })
}

export async function queryRecords(params){
  return request({
    url: banks + "/" + params.id + "/records",
    method: 'get',
  })
}

export async function status (params) {
  return request({
    url: banks + "/" + params.id + "/status",
    method: 'post',
    data:params
  })
}


export async function create (params) {
  return request({
    url: banks,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: banks  + "/" + params.id , 
    method: 'delete',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: banks  + "/" + params.id ,
    method: 'put',
    data: params,
  })
}

export async function saveRelatedQuestions(params){
  return request({
    url: banks + "/" + params.id + "/questions",
    method: 'post',
    data: {questions:params.questions}
  })
}

export async function getTags(params){
  return request({
    url: banks + "/" + params.id + "/tags",
    method:'get',
    data:params
  })
}

export async function relatingTag(params){
  return request({
    url: banks + "/" + params.id + "/tags",
    method: 'post',
    data: params
  })
}

export async function saveTag(params){
  return request({
    url: "/banktags",
    method: 'post',
    data: params
  })
}

export async function removeRelatedTag(params){
  return request({
    url: banks + "/" + params.id + "/tags",
    method: 'delete',
    data: params,
  })
}

export async function deleteTag(params){
  return request({
    url: "/banktags",
    method: 'delete',
    data: params,
  })
}

export async function queryAllTags(params){
  return request({
    url: "/banktags",
    method:'get',
    data:params
  })
}

export async function queryRelatedQuestions(params){
  return request({
    url: banks + "/" + params.id + "/questions",
    method: 'get',
    data: params,
  })
}

export async function removeRelatedQuestions(params){
  return request({
    url: banks + "/" + params.id + "/questions",
    method: 'delete',
    data: params,
  })
}