import { request } from 'utils/request'
import { userInfo } from 'utils'

export async function query (params) {
  return request({ wsfunction: 'mod_frontservice_getclassrooms', school_id: userInfo.school_id, ...params })
}
