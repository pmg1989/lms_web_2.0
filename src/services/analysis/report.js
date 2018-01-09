import { request } from 'utils/request'

export async function queryTeacherReport (params) {
  return request({ wsfunction: 'mod_frontservice_get_op_teacher', ...params })
}

export async function queryProTeacherReport (params) {
  return request({ wsfunction: 'mod_frontservice_get_op_proteacher', ...params })
}

export async function queryLessonCompleteReport (params) {
  return request({ wsfunction: 'mod_frontservice_get_op_lesson_complete', ...params })
}
