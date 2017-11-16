import { request } from 'utils/request'

export async function update (params) {
  return request({ wsfunction: 'mod_frontservice_modifypassword', ...params })
}
