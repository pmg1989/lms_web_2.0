// 基本权限
export const MENU = 1 // 显示菜单
export const CONTENT = 2 // 查看页面
export const ADD = 3 // 新增
export const UPDATE = 4 // 修改
export const DELETE = 5 // 删除
export const DETAIL = 6 // 详情
// 扩展权限
export const FROZEN = 7 // 冻结账户
export const RESIGN = 8 // 离职
export const LEAVE = 9 // 请假
export const SET_TEACHER = 10 // 设置老师
export const GET_HISTORY_LIST = 11 // 查看合同的操作历史记录
export const ADD_DAI_TEACHER = 12 // 添加代课老师
export const ADD_DELETE_STUDENT = 13 // 学员排课/退课

export const powerName = {
  [MENU]: '查看菜单',
  [CONTENT]: '查看页面',
  [DETAIL]: '详情',
  [ADD]: '新增',
  [UPDATE]: '修改',
  [DELETE]: '删除',

  [FROZEN]: '冻结账户',
  [RESIGN]: '离职',
  [LEAVE]: '请假',
  [SET_TEACHER]: '设置老师',
  [GET_HISTORY_LIST]: '查看历史',
  [ADD_DAI_TEACHER]: '添加代课老师',
  [ADD_DELETE_STUDENT]: '学员排课/退课',
}
