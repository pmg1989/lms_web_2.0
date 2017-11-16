/* global FormData */
import fetch from 'isomorphic-fetch'
import NProgress from 'nprogress'
import { message } from 'antd'
import { wstoken } from 'config'

// message 全局配置
message.config({
  top: 50,
})

function checkStatus (res) {
  if (res.status >= 200 && res.status < 300) {
    return res.json()
  }

  const error = new Error(res.statusText)
  error.response = res
  throw error
}

function handelData (res) {
  NProgress.done()
  if (res.status !== 10000 && res.message && !!res.message.length) {
    message.error(res.message)
  }
  return { ...res, success: res.status === 10000 }
}

function handleError (error) {
  NProgress.done()
  const data = error.response.data
  if (data.errors) {
    message.error(`${data.message}：${data.errors}`, 5)
  } else if (data.error) {
    message.error(`${data.error}：${data.error_description}`, 5)
  } else {
    message.error('未知错误！', 5)
  }
  return { success: false }
}

export function request (data, method = 'POST') {
  NProgress.start()
  let body = new FormData()
  body.append('wstoken', wstoken)
  body.append('moodlewsrestformat', 'json')
  for (let key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      body.append(key, data[key])
    }
  }
  const baseURL = '/api/moodle/webservice/rest/server.php'
  return fetch(baseURL, { body, method })
    .then(checkStatus)
    .then(handelData)
    .catch(handleError)
}
