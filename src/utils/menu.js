// power = { 1: "查看菜单", 2: "查看详情", 3: "新增", 4: "修改", 5: "删除", 6: "审核", 7: "上传" }
// options = { MENU: "查看菜单", DETAIL: "查看详情", ADD: "新增", UPDATE: "修改", DELETE: "删除", CHECK: "审核", UPLOAD: "上传" }

const menu = [
  // dashboard
  {
    id: 1,
    key: 'dashboard',
    name: '管理平台',
    icon: 'laptop',
    power: [1, 2],
  },
  // account
  {
    id: 2,
    key: 'account',
    name: '用户管理',
    icon: 'user',
    clickable: false,
    power: [1],
    children: [
      {
        id: 21,
        key: 'admin',
        name: '管理员',
        power: [1, 2, 3, 4, 5],
      },
      {
        id: 22,
        key: 'role',
        name: '管理员角色',
        power: [1, 2, 3, 4, 5],
      },
      {
        id: 23,
        key: 'user',
        name: '用户',
        power: [1, 2, 3, 4, 5],
      },
    ],
  },
  // system
  {
    id: 3,
    key: 'system',
    name: '系统管理',
    icon: 'appstore',
    clickable: false,
    power: [1],
    children: [
      {
        id: 31,
        key: 'modify-password',
        name: '修改密码',
        power: [1, 2, 4],
      },
    ],
  },
]

export default menu
