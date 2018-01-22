import { request } from 'utils/request'

export async function queryLessonsChart (params) {
  return request({ wsfunction: 'mod_frontservice_getupcominglessons', ...params })
}
