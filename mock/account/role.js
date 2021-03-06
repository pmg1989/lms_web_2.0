const qs = require('qs')
const Mock = require('mockjs')

const dic = {
  1: {
    1: [1, 2],
    2: [1],
    21: [1, 2, 3, 4, 5],
    22: [1, 2, 3, 4, 5, 6],
    23: [2, 3],
    24: [2, 4, 12, 13, 14],
    25: [2, 4],
    3: [1],
    31: [1, 2, 3, 4, 5, 6],
    32: [1, 2, 3, 4, 5, 6, 8, 9],
    33: [1, 2, 4, 6, 10, 11],
    4: [1],
    41: [1, 2, 4],
  },
  2: {
    1: [1, 2],
    2: [1],
    21: [1, 2],
    22: [1, 2],
    23: [1, 2],
    3: [1],
    31: [1, 2, 4],
  },
  3: {
    1: [1, 2],
    2: [1],
    23: [1, 2],
    3: [1],
    31: [1, 2, 4],
  },
}

let roleList = Mock.mock({
  'data|3': [
    {
      'id|+1': 1,
      'name|+1': ['管理员', '教师', 'HR专员'],
      'enname|+1': ['admin', 'teacher', 'hr'],
      'power|+1': [dic[1], dic[2], dic[3]],
    },
  ],
  page: {
    total: 3,
    current: 1,
  },
})

global.powerList = dic

module.exports = {

  'GET /api/role': function (req, res) {
    const page = qs.parse(req.query)
    const pageSize = page.pageSize || 10
    const currentPage = page.page || 1

    let data
    let newPage

    let newData = roleList.data.concat()

    if (page.field) {
      const d = newData.filter((item) => {
        return item[page.field].indexOf(decodeURI(page.keyword)) > -1
      })

      data = d.slice((currentPage - 1) * pageSize, currentPage * pageSize)

      newPage = {
        current: currentPage * 1,
        total: d.length,
      }
    } else {
      data = roleList.data.slice((currentPage - 1) * pageSize, currentPage * pageSize)
      roleList.page.current = currentPage * 1
      newPage = roleList.page
    }
    res.json({ success: true, list: data, page: { ...newPage, pageSize: Number(pageSize) } })
  },

  'POST /api/role': function (req, res) {
    const curItem = req.body

    if (curItem.id) {
      roleList.data = roleList.data.map((item) => {
        if (item.id === curItem.id) {
          return { ...curItem, power: JSON.parse(curItem.power) }
        }
        return item
      })
    } else {
      curItem.id = roleList.data.length + 1
      roleList.data.push({ ...curItem, power: JSON.parse(curItem.power) })

      roleList.page.total = roleList.data.length
      roleList.page.current = 1
    }

    global.powerList = { ...global.powerList, [curItem.id]: JSON.parse(curItem.power) }
    res.json({ success: true, data: roleList.data, page: roleList.page })
  },

  'DELETE /api/role': function (req, res) {
    const deleteItem = req.body

    roleList.data = roleList.data.filter((item) => {
      return item.id !== deleteItem.id
    })

    roleList.page.total = roleList.data.length

    delete global.powerList[deleteItem.id]

    res.json({ success: true, data: roleList.data, page: roleList.page })
  },

}
