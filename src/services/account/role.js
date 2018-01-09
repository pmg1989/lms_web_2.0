import { request } from 'utils/request'

export async function query (params) {
  return request({ wsfunction: 'mod_frontservice_get_power_list', ...params })
}

export async function update (params) {
  return request({ wsfunction: 'mod_frontservice_update_power', ...params })
}

export async function create (params) {
  return request('/api/role', {
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request('/api/role', {
    method: 'delete',
    data: params,
  })
}
