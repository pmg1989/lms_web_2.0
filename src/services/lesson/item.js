import { request } from 'utils/request'

export async function query (params) {
  return request({ wsfunction: 'mod_frontservice_getlessoninfo', ...params })
}

export async function queryCourseCategory (params) {
  return request({ wsfunction: 'mod_frontservice_getcoursecategory', ...params })
}

export async function create (params) {
  return request({ wsfunction: '', ...params })
}

export async function update (params) {
  return request({ wsfunction: '', ...params })
}
