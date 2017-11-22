import { request } from 'utils/request'

export async function query (params) {
  return request({ wsfunction: 'mod_frontservice_getuserinfo', ...params })
}

export async function get (params) {
  return request('/api/adminItem', {
    method: 'get',
    data: params,
  })
}

export async function update (params) {
  return request({ wsfunction: 'mod_frontservice_modifyprofile', ...params })
}

export async function create (params) {
  return request('/api/admin', {
    method: 'post',
    data: params,
  })
}
