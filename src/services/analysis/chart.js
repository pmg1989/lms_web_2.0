import { request } from 'utils/request'

export async function queryLessonsChart (params) {
  return request({ wsfunction: 'mod_frontservice_get_op_teacher', ...params })
}
