import { request } from 'utils/request'

export async function queryComingLessons (params) {
  return request({ wsfunction: 'mod_frontservice_getupcominglessons', ...params })
}

export async function queryTeacherStatInfo (params) {
  return request({ wsfunction: 'mod_frontservice_get_statinfo_teacher', ...params })
}
