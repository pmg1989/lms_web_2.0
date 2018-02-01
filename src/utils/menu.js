// 权限的基本操作 详细可参见 ../constants/options.js
// power = { 1: "查看菜单", 2: "查看页面", 3: "新增", 4: "修改", 5: "删除", 6: "详情" }
// options = { MENU: "查看菜单", CONTENT: "查看页面", ADD: "新增", UPDATE: "修改", DELETE: "删除", DETAIL: "详情" }
import { praceticeDoman } from 'utils/config'

const menu = [
  // dashboard
  {
    id: 1,
    key: 'dashboard',
    icon: 'desktop',
    name: '管理平台',
    power: [1, 2],
  },
  // lesson
  {
    id: 2,
    key: 'lesson',
    icon: 'idcard',
    name: '课程管理',
    clickable: false,
    power: [1],
    children: [
      {
        id: 21,
        key: 'calendar',
        icon: 'calendar',
        name: '日历管理',
        power: [1, 2, 3, 4, 5],
      },
      {
        id: 22,
        key: 'list',
        icon: 'bars',
        name: '课程列表',
        power: [1, 2, 3, 4, 5, 6],
      },
      {
        id: 23,
        key: 'create',
        name: '排课',
        power: [2, 3],
      },
      {
        id: 24,
        key: 'update',
        name: '修改课程',
        power: [2, 4, 12, 13, 14],
      },
      {
        id: 25,
        key: 'detail',
        name: '查看课程',
        power: [2, 4],
      },
    ],
  },
  // account
  {
    id: 3,
    key: 'account',
    icon: 'user',
    name: '用户管理',
    clickable: false,
    power: [1],
    children: [
      {
        id: 31,
        key: 'role',
        icon: 'setting',
        name: '角色管理',
        power: [1, 2, 4],
      },
      {
        id: 32,
        key: 'admin',
        icon: 'woman',
        name: '工作人员',
        power: [1, 2, 3, 4, 5, 6, 8, 9, 15],
      },
      {
        id: 33,
        key: 'user',
        icon: 'team',
        name: '学员',
        power: [1, 2, 6, 10, 11],
      },
    ],
  },
  // system
  {
    id: 4,
    key: 'system',
    icon: 'appstore',
    name: '系统管理',
    clickable: false,
    power: [1],
    children: [
      {
        id: 41,
        key: 'modify-password',
        icon: 'unlock',
        name: '修改密码',
        power: [1, 2, 4],
      },
    ],
  },
  // analysis
  {
    id: 5,
    key: 'analysis',
    icon: 'area-chart',
    name: '数据分析',
    clickable: false,
    power: [1],
    children: [
      {
        id: 51,
        key: 'report',
        icon: 'bars',
        name: '报表统计',
        power: [1, 2],
      },
      {
        id: 52,
        key: 'chart',
        icon: 'pie-chart',
        name: '仪表盘',
        power: [1, 2],
      },
      {
        id: 53,
        key: 'my-chart',
        icon: 'pie-chart',
        name: '我的仪表盘',
        power: [1, 2],
      },
    ],
  },
  // practice
  {
    id: 6,
    key: 'practice',
    icon: 'customer-service',
    name: '练声曲管理',
    clickable: false,
    power: [1],
    children: [
      {
        id: 61,
        key: 'list',
        icon: 'bars',
        name: '练声曲',
        power: [1],
        outLink: () => {
          const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}')
          return `${praceticeDoman}/signin/practice/${userInfo.teacher_info}`
        },
      },
      {
        id: 62,
        key: 'test',
        icon: 'bars',
        name: '学员测试',
        power: [1],
        outLink: () => {
          const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}')
          return `${praceticeDoman}/signin/exam/${userInfo.teacher_info}`
        },
      },
    ],
  },
]

export default menu
