import { request } from 'utils/request'

export async function query (params) {
  return request({ wsfunction: 'mod_frontservice_studentinfo_by_lesson', ...params })
}

export async function attendance (params) {
  return request({ wsfunction: 'mod_frontservice_doattendance', ...params })
}
