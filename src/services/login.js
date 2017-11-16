import { request } from 'utils/request'

export async function login (params) {
  return request({ wsfunction: 'mod_serviceauthorize_signin', ...params })
}
