import axios from 'axios'
import qs from 'qs'
import { CORS, baseURL } from './config'
import lodash from 'lodash'

var http = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});


if ( localStorage.jwtToken ) {
  http.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.jwtToken 
}

http.interceptors.request.use(function (config) {
    if ( localStorage.jwtToken ) {
      http.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.jwtToken 
    }

    return config
  }, function (error) {
    return Promise.reject(error)
  });

// http.interceptors.response.use(function (response) {
//     console.log("response",response)
//      if ( response.data.status === 401 ){
//         browserHistory.push('/api/v1/auth/login') ;
//     }
//     return response;
//   },function(error){
//     if ( error.response.status === 401 ){
//       browserHistory.push('/api/v1/auth/login') ;
//     }
//     return Promise.reject(error);
// });


const fetch = (options) => {
  let {
    method = 'get',
    data,
    fetchType,
    url,
  } = options


  switch (method.toLowerCase()) {
    case 'get':
      return http.get(`${url}${!lodash.isEmpty(data) ? `?${qs.stringify(data)}` : ''}`)
    case 'delete':
      return http.delete(url, { data })
    case 'head':
      return http.head(url, data)  
    case 'post':
      return http.post(url, data)
    case 'put':
      return http.put(url, data)
    case 'patch':
      return http.patch(url, data)
    default:
      return http(options)
  }
}

export default function request (options) {

  return fetch(options).then((response) => {
    const { message, code } = response.data
    let data =  response.data
    if ( code > 10400 ){
       return  { success: false, status:code, message }
    }else {
      return {
        success: true,
        message,
        status:code,
        ...data,
      }
    }
  }).catch((error) => {
    const { response } = error
    let message
    let status
    if (response) {
      status = response.status
      const { data, statusText } = response
      message = data.message || statusText
    } else {
      status = 600
      message = 'Network Error' + error 
    }
    return { success: false, status, message }
  })
}
