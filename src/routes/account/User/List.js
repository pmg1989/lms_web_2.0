import React from 'react'
import PropTypes from 'prop-types'
import { Menu } from 'antd'
import { DataTable, DropMenu } from 'components'
import { DETAIL, UPDATE } from 'constants/options'
import styles from './List.less'

function List ({
  accountUser: {
    list,
    pagination,
  },
  location,
  loading,
  detailPower,
  updatePower,
  onDetailItem,
  onEditItem,
}) {
  const handleMenuClick = (key, record) => {
    return {
      [DETAIL]: onDetailItem,
      [UPDATE]: onEditItem,
    }[key](record)
  }

  const columns = [
    {
      title: '头像',
      dataIndex: 'image',
      key: 'image',
      width: 64,
      className: styles.avatar,
      render: text => <img width={24} src={text} alt={text} />,
    }, {
      title: '用户名',
      dataIndex: 'uname',
      key: 'uname',
    }, {
      title: '真实姓名',
      dataIndex: 'firstname',
      key: 'firstname',
    }, {
      title: '手机号',
      dataIndex: 'phone2',
      key: 'phone2',
    }, {
      title: '学号',
      dataIndex: 'idnumber',
      key: 'idnumber',
    }, {
      title: '校区',
      dataIndex: 'school',
      key: 'school',
    }, {
      title: '报名课程',
      dataIndex: 'created_at',
      key: 'created_at',
    }, {
      title: '下节课',
      dataIndex: 'status',
      key: 'status',
    }, {
      title: '操作',
      key: 'operation',
      // width: 80,
      render: (text, record) => (
        <DropMenu>
          <Menu onClick={({ key }) => handleMenuClick(key, record)}>
            {detailPower && <Menu.Item key={DETAIL}>查看</Menu.Item>}
            {updatePower && <Menu.Item key={UPDATE}>编辑</Menu.Item>}
          </Menu>
        </DropMenu>
      ),
      // fixed: 'right'
    },
  ]

  let total = pagination.total

  const getFilterList = () => {
    const { field, keyword, hasTeacher, current, pageSize } = location.query
    const currentPage = current || pagination.current
    const sizePage = pageSize || pagination.pageSize

    if (field || hasTeacher) {
      const filterTotalList = list.filter((item) => {
        const hasTeachers = hasTeacher ? item.student_has_teacher === (+hasTeacher === 1) : true
        const hasKeyWords = keyword ? item[field].includes(decodeURI(keyword)) : true
        return hasKeyWords && hasTeachers
      })
      total = filterTotalList.length
      const filterList = filterTotalList.slice((currentPage - 1) * (sizePage), currentPage * sizePage)
      return filterList
    }
    return list
  }

  return (
    <DataTable
      className={styles.table}
      columns={columns}
      dataSource={getFilterList()}
      loading={loading.effects['accountUser/query']}
      pagination={{ ...pagination, total }}
      rowKey={record => record.id}
    />
  )
}

List.propTypes = {
  location: PropTypes.object.isRequired,
  accountUser: PropTypes.object.isRequired,
  loading: PropTypes.object.isRequired,
  detailPower: PropTypes.bool.isRequired,
  updatePower: PropTypes.bool.isRequired,
  onDetailItem: PropTypes.func.isRequired,
  onEditItem: PropTypes.func.isRequired,
}

export default List
