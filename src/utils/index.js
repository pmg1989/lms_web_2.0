import { browserHistory } from 'react-router'
import { Base64 } from 'js-base64'
import menu from './menu'
import Cookie from './cookie'

import config from './config'
import request from './request'

export { color } from './theme'

let allPathPowers // 缓存 localStorage.getItem('allPathPowers') 数据
let userInfo = JSON.parse(localStorage.getItem('user_info') || '{}') // 缓存用户信息

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

const setLoginIn = (data, pathPowers, formProps) => {
  const now = new Date()
  if (formProps.remember) {
    now.setDate(now.getDate() + 7)
    Cookie.set('user_session', now.getTime())
    Cookie.set('user_password', Base64.encode(formProps.password))
  } else {
    now.setDate(now.getDate() + 1)
    Cookie.set('user_session', now.getTime())
    Cookie.remove('user_password')
  }
  Cookie.set('user_name', data.uname)
  Cookie.set('utoken', data.utoken)
  Cookie.set('user_power', data.power)
  localStorage.setItem('user_info', JSON.stringify(data))
  localStorage.setItem('allPathPowers', JSON.stringify(pathPowers))
  allPathPowers = pathPowers
  userInfo = data
}

const setLoginOut = () => {
  Cookie.remove('user_session')
  Cookie.remove('utoken')
  Cookie.remove('user_power')
  localStorage.removeItem('user_info')
  localStorage.removeItem('allPathPowers')
  allPathPowers = null
  userInfo = {}
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

function getUserInfo () {
  return userInfo
}

function renderQuery (storeQuery, payload) {
  const searchQuery = { ...storeQuery, ...payload }
  for (let key in searchQuery) {
    // 过滤掉为空的查询 && school 为空时不过滤（school=''表示查询所有校区数据）
    if (!searchQuery[key] && key !== 'school') {
      delete searchQuery[key]
    }
  }
  return searchQuery
}

const getSchool = () => {
  if (userInfo.school) {
    return userInfo.school
    // return userInfo.school !== 'global' ? userInfo.school : 'bj01'
  }
  const user = JSON.parse(localStorage.getItem('user_info') || '{}')
  userInfo = user
  return user.school
  // return user.school !== 'global' ? user.school : 'bj01'
}

const renderMessages = (list) => {
  return list.map((item) => {
    const params = JSON.parse(item.fullmessage)
    const dic = {
      TEACHER_FEEDBACK: {
        id: item.id,
        linkTo: `/lesson/update?lessonid=${params.lesson_id}`,
        message: '你的课已经结束，快去写评论哦~',
      },
      TEACHER_ATTENDANCE: {
        id: item.id,
        linkTo: `/lesson/update?lessonid=${params.lesson_id}`,
        message: '你的课已经开始，快去打考勤哦~',
      },
    }
    return dic[item.subject]
  })
}

const isMobile = () => {
  return /Android|webOS|iOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)
}

export {
  Cookie,
  menu,
  config,
  request,
  equalSet,
  isLogin,
  setLoginIn,
  setLoginOut,
  checkPower,
  getCurPowers,
  queryString,
  renderQuery,
  getSchool,
  getUserInfo,
  renderMessages,
  isMobile,
}
