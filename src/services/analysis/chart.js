import { request } from 'utils/request'

export async function queryTeacherChart (params) {
  return request({ wsfunction: 'mod_frontservice_get_op_teacher', ...params })
}

export async function queryProTeacherChart (params) {
  return request({ wsfunction: 'mod_frontservice_get_op_proteacher', ...params })
}

export async function queryLessonCompleteChart (params) {
  return request({ wsfunction: 'mod_frontservice_get_op_lesson_complete', ...params })
}

