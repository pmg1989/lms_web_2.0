import { browserHistory } from 'react-router'
import menu from './menu'
import Cookie from './cookie'

import config from './config'
import request from './request'

export { color } from './theme'

let allPathPowers // 缓存 localStorage.getItem('allPathPowers') 数据

// 连字符转驼峰
String.prototype.hyphenToHump = function () {
  return this.replace(/-(\w)/g, (...args) => {
    return args[1].toUpperCase()
  })
}

// 驼峰转连字符
String.prototype.humpToHyphen = function () {
  return this.replace(/([A-Z])/g, '-$1').toLowerCase()
}

// 日期格式化
Date.prototype.format = function (format) {
  let o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'H+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    S: this.getMilliseconds(),
  }
  if (/(y+)/.test(format)) { format = format.replace(RegExp.$1, (`${this.getFullYear()}`).substr(4 - RegExp.$1.length)) }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1
        ? o[k]
        : (`00${o[k]}`).substr((`${o[k]}`).length))
    }
  }
  return format
}

function equalSet (a, b) {
  const as = new Set(a)
  const bs = new Set(b)
  if (as.size !== bs.size) return false
  for (let ai of as) if (!bs.has(ai)) return false
  return true
}

const isLogin = () => {
  return Cookie.get('user_session') && Cookie.get('user_session') > new Date().getTime()
}

const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}')

const setLoginIn = (data, pathPowers) => {
  const now = new Date()
  now.setDate(now.getDate() + 1)
  Cookie.set('user_session', now.getTime())
  Cookie.set('utoken', data.utoken)
  Cookie.set('user_power', data.role_power)
  localStorage.setItem('user_info', JSON.stringify(data))
  localStorage.setItem('allPathPowers', JSON.stringify(pathPowers))
  allPathPowers = pathPowers
}

const setLoginOut = () => {
  Cookie.remove('user_session')
  Cookie.remove('utoken')
  Cookie.remove('user_power')
  localStorage.removeItem('user_info')
  localStorage.removeItem('allPathPowers')
  allPathPowers = null
}

const checkPower = (optionId, curPowers = []) => {
  return curPowers.some(cur => cur === optionId)
}

const getCurPowers = (curPath) => {
  if (!allPathPowers) {
    allPathPowers = JSON.parse(localStorage.getItem('allPathPowers'))
  }
  const curPathPower = allPathPowers && allPathPowers[curPath]
  // cur =2 检测查看页面内容权限
  if (!curPathPower || !curPathPower.find(cur => cur === 2)) {
    browserHistory.push({ pathname: '/no-power' })
    return false
  }
  return curPathPower // 返回curPathPower，是为方便页面跳转验证权限后，dispatch当然权限
}

// 根据key获取url中的参数
function queryString (value) {
  const reg = new RegExp(`(^|&)${value}=([^&]*)(&|$)`, 'i')
  const r = location.search.substr(1).match(reg)
  if (r != null) {
    return decodeURIComponent(r[2])
  }
  return null
}

function renderQuery (query, payload) {
  const searchQuery = { ...query, ...payload }
  for (let key in searchQuery) {
    if (!searchQuery[key]) {
      delete searchQuery[key]
    }
  }
  return searchQuery
}

const getSchool = () => {
  if (userInfo.school) {
    return userInfo.school !== 'global' ? userInfo.school : 'bj01'
  }
  const user = JSON.parse(localStorage.getItem('user_info') || '{}')
  return user.school !== 'global' ? user.school : 'bj01'
}

export {
  Cookie,
  menu,
  config,
  request,
  equalSet,
  isLogin,
  userInfo,
  setLoginIn,
  setLoginOut,
  checkPower,
  getCurPowers,
  queryString,
  renderQuery,
  getSchool,
}
