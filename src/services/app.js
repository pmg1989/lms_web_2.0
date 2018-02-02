import { request } from 'utils/request'
import { Cookie } from 'utils'

export async function logout (params) {
  return request({ wsfunction: 'mod_serviceauthorize_signout', utoken: Cookie.get('utoken'), ...params })
}

export async function queryMessageList (params) {
  return request({ wsfunction: 'mod_frontservice_receivemessage', ...params })
}

export async function readMessage (params) {
  return request({ wsfunction: 'mod_frontservice_readmessage', ...params })
}

export async function queryComingLessons (params) {
  return request({ wsfunction: 'mod_frontservice_getupcominglessons', ...params })
}
