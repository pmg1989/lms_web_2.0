import React from 'react'
import PropTypes from 'prop-types'
import { Menu } from 'antd'
import { DataTable, DropMenu } from 'components'
import { UPDATE } from 'constants/options'
import styles from './List.less'

function List ({
  accountRole: {
    list,
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
      title: '角色编号',
      dataIndex: 'id',
      key: 'id',
    }, {
      title: '角色名称',
      dataIndex: 'name',
      key: 'roleName',
    }, {
      title: '操作',
      key: 'operation',
      // width: 100,
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
      loading={loading}
      pagination={false}
      rowKey={record => record.id}
    />
  )
}

List.propTypes = {
  accountRole: PropTypes.object.isRequired,
  onEditItem: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  updatePower: PropTypes.bool.isRequired,
}

export default List
