import { request } from 'utils/request'

export async function query (params) {
  return request({ wsfunction: 'mod_frontservice_getuserinfo', ...params })
}

export async function queryItem (params) {
  return request({ wsfunction: 'mod_frontservice_getuserbyid', ...params })
}

export async function queryClassRooms (params) {
  return request({ wsfunction: 'mod_frontservice_getclassrooms', ...params })
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
