import { request } from 'utils/request'

export async function query (params) {
  return request({ wsfunction: 'mod_frontservice_getlessons', ...params })
}

export async function deleteBatch (params) {
  return request({ wsfunction: 'mod_frontservice_deletelessons', ...params })
}