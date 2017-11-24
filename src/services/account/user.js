import { request } from 'utils/request'

export async function queryContractList (params) {
  return request({ wsfunction: 'mod_frontservice_my_contractccs', ...params })
}
