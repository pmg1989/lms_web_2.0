import { request } from 'utils/request'

export async function query (params) {
  return request({ wsfunction: 'mod_frontservice_getuserinfo', ...params })
}

export async function queryItem (params) {
  return request({ wsfunction: 'mod_frontservice_getuserbyid', ...params })
}

export async function update (params) {
  return request({ wsfunction: 'mod_frontservice_modifyprofile', ...params })
}

export async function create (params) {
  return request({ wsfunction: 'mod_frontservice_createuser', ...params })
}

export async function updateLevel (params) {
  return request({ wsfunction: 'mod_frontservice_leave_teacher', ...params })
}

export async function updateCancelLevel (params) {
  return request({ wsfunction: 'mod_frontservice_unleave_teacher', ...params })
}
