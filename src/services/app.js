import { request } from 'utils/request'
import { Cookie } from 'utils'

export async function logout (params) {
  return request({ wsfunction: 'mod_serviceauthorize_signout', utoken: Cookie.get('utoken'), ...params })
}

export async function userInfo (params) {
  return request('/api/userInfo', {
    method: 'get',
    data: params,
  })
}
