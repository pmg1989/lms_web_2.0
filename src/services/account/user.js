import { request } from 'utils/request'

export async function queryContractList (params) {
  return request({ wsfunction: 'mod_frontservice_my_contractccs', ...params })
}

export async function updateTeacher (params) {
  return request({ wsfunction: 'mod_frontservice_modifycontract', ...params })
}

export async function queryHistoryList (params) {
  return request({ wsfunction: 'mod_frontservice_get_contract_log', ...params })
}

export async function queryContractLesson (params) {
  return request({ wsfunction: 'mod_frontservice_get_enrolledlessons_cc', ...params })
}
