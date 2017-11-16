import { request } from 'utils/request'

export async function logout (params) {
  return request({ wsfunction: 'mod_serviceauthorize_signout', ...params })
}

export async function userInfo (params) {
  return request('/api/userInfo', {
    method: 'get',
    data: params,
  })
}
