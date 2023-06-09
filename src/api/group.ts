import axios from 'axios'
import { baseURL, baseConfig, jsonConfig } from './baseConfig'
const request = axios.create({
  baseURL: `${baseURL}/group`
})

export const createUserGroupApi = (data: any) => {
  return request.post('/create', data, jsonConfig)
}

export const getGroupApi = (id: string) => {
  return request.get(`/show/${id}`)
}

export const createStandardUserApi = (id: string, num: number) => {
  return request.post(`/standard/create/${id}/${num}`, {}, baseConfig)
}

export const getStandardUserListApi = (id: string) => {
  return request.get(`/standard/list/${id}`, baseConfig)
}

export const getUserGroupMembersApi = (
  id: string,
  pageNum = 1,
  pageSize = 20
) => {
  return request.get(`/user/list/${id}?pageNum=${pageNum}&pageSize=${pageSize}`)
}

//apply
export const applyEnterGroupApi = (id: string, data: any) => {
  return request.post(`/apply/${id}`, data, jsonConfig)
}

//search
export const searchGroupByTextApi = (text: string) => {
  return request.get(`/search/${text}`)
}

export const searchGroupByLabelApi = (labels: string[]) => {
  return request.get(`/search/label?labels=${labels}`)
}

export const searthGroupByTextAndLabelApi = (
  text: string,
  labels: string[],
  pageNum = 1,
  pageSize = 20
) => {
  return request.get(
    `/search/with/label/${text}?pageNum=${pageNum}&pageSize=${pageSize}&labels=${labels}`
  )
}

//other

export const getUserGroupListApi = (id: string, pageNum = 1, pageSize = 20) => {
  return request.get(
    `/leader/list/${id}?pageNum=${pageNum}&pageSize=${pageSize}`
  )
}
