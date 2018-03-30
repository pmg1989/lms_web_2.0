import { request } from 'utils/request'

export async function query (params) {
  for (let key in params) {
    // 过滤掉为空的查询 && school 为空时不过滤（school=''表示查询所有校区数据）
    if (!params[key] && key !== 'school') {
      delete params[key]
    }
  }
  console.log(params)
  return request({ wsfunction: 'mod_frontservice_getlessons', ...params })
}

export async function remove (params) {
  return request({ wsfunction: 'mod_frontservice_deletelesson', ...params })
}

export async function removeCourse (params) {
  return request({ wsfunction: 'mod_frontservice_deletecourse', ...params })
}

export async function deleteBatch (params) {
  return request({ wsfunction: 'mod_frontservice_deletelessons', ...params })
}
