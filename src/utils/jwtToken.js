import axios from 'axios'

export function setAuthorizationToken(token) {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete axios.defaults.headers.common['Authorization']
  }
}

export  function saveToken(token){
  localStorage.setItem('jwtToken', token)
  console.log(localStorage.jwtToken )
}

export  function removeToken(){
  localStorage.removeItem('jwtToken')
}