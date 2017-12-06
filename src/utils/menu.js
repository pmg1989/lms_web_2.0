const getSchool = () => {
  const user = JSON.parse(localStorage.getItem('user_info') || '{}')
  return user.school !== 'global' ? user.school : 'bj01'
}

// 权限的基本操作 详细可参见 ../constants/options.js
// power = { 1: "查看菜单", 2: "查看详情", 3: "新增", 4: "修改", 5: "删除" }
// options = { MENU: "查看菜单", DETAIL: "查看详情", ADD: "新增", UPDATE: "修改", DELETE: "删除" }

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
        key: 'role',
        name: '角色管理',
        power: [1, 2, 3, 4, 5],
      },
      {
        id: 22,
        key: 'admin',
        name: '工作人员',
        power: [1, 2, 3, 4, 5, 6, 8, 9],
        query: {
          school: getSchool(),
        },
      },
      {
        id: 23,
        key: 'user',
        name: '学员',
        power: [1, 2, 6, 10, 11],
        query: {
          school: getSchool(),
        },
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
