import axios from 'axios'
import { baseURL, baseConfig } from './baseConfig'
const request = axios.create({
  baseURL: `${baseURL}/user`
})

export const searchUserByTextApi = (
  text: string,
  pageNum = 1,
  pageSize = 20
) => {
  return request.get(`/search/${text}?pageNum=${pageNum}&pageSize=${pageSize}`)
}

export const getVerifyApi = (id: string) => {
  return request.get(`/verify/${id}`)
}

export const registerApi = (data: any) => {
  return request.post('regist', data)
}

export const loginApi = (data: any) => {
  return request.post('/login', data)
}

export const securityApi = (data: any) => {
  return request.put('/security', data, {})
}

export const updateInfoApi = (data: any, config = baseConfig) => {
  return request.put('/update', data, config)
}

export const getCurrentUserinfo = () => {
  return request.get('/info', baseConfig)
}

export const getUserInfoApi = (id: string) => {
  return request.get(`/show/${id}`)
}
