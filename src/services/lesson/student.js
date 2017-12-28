import { request } from 'utils/request'

export async function query (params) {
  return request({ wsfunction: 'mod_frontservice_studentinfo_by_lesson', ...params })
}

export async function attendance (params) {
  return request({ wsfunction: 'mod_frontservice_doattendance', ...params })
}

export async function queryComment (params) {
  return request({ wsfunction: 'mod_frontservice_get_assignfeedbackcomment', ...params })
}

export async function queryFeedback (params) {
  return request({ wsfunction: 'mod_frontservice_getsubmission', ...params })
}
