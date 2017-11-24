import { request } from 'utils/request'
import requestMock from 'utils/request-mock'

export async function query (params) {
  return requestMock('/api/role', {
    method: 'get',
    data: params,
  })
}

export async function create (params) {
  return request('/api/role', {
    method: 'post',
    data: params,
  })
}

export async function update (params) {
  return request('/api/role', {
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request('/api/role', {
    method: 'delete',
    data: params,
  })
}
