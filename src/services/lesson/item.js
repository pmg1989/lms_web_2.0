import { request } from 'utils/request'

export async function query (params) {
  return request({ wsfunction: 'mod_frontservice_getlessoninfo', ...params })
}

export async function queryCourseCategory (params) {
  return request({ wsfunction: 'mod_frontservice_getcoursecategory', ...params })
}

export async function create (params) {
  return request({ wsfunction: 'mod_frontservice_createcourse', ...params })
}

export async function update (params) {
  return request({ wsfunction: 'mod_frontservice_modifylesson', ...params })
}

export async function enrollesson (params) {
  return request({ wsfunction: 'mod_frontservice_enrollesson', ...params })
}

export async function unenrollesson (params) {
  return request({ wsfunction: 'mod_frontservice_unenrollesson', ...params })
}
