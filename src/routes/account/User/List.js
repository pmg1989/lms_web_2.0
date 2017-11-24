import React from 'react'
import PropTypes from 'prop-types'
import { Menu } from 'antd'
import { DataTable, DropMenu } from 'components'
import { UPDATE } from 'constants/options'
import styles from './List.less'

function List ({
  accountUser: {
    list,
    pagination,
  },
  loading,
  updatePower,
  onEditItem,
}) {
  const handleMenuClick = (key, record) => {
    return {
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
            {updatePower && <Menu.Item key={UPDATE}>编辑</Menu.Item>}
          </Menu>
        </DropMenu>
      ),
      // fixed: 'right'
    },
  ]

  return (
    <DataTable
      className={styles.table}
      columns={columns}
      dataSource={list}
      loading={loading.effects['accountUser/query']}
      pagination={pagination}
      rowKey={record => record.id}
    />
  )
}

List.propTypes = {
  accountUser: PropTypes.object.isRequired,
  loading: PropTypes.object.isRequired,
  updatePower: PropTypes.bool.isRequired,
  onEditItem: PropTypes.func.isRequired,
}

export default List
