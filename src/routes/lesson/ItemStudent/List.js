import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Modal } from 'antd'
import { DataTable, DropMenu } from 'components'
import { ADD, UPDATE, DETAIL, DELETE } from 'constants/options'
import styles from './List.less'

const confirm = Modal.confirm

function List ({
  lessonStudent: {
    list,
  },
  loading,
  addDeletePower,
  otherPower,
  onDeleteItem,
}) {
  const handleMenuClick = (key, record) => {
    if (+key === DELETE) {
      confirm({
        title: '您确定要删除课程吗?',
        onOk () {
          onDeleteItem({ lessonid: record.id })
        },
      })
    }
  }

  const columns = [
    {
      title: '姓名',
      dataIndex: 'firstname',
      key: 'firstname',
    }, {
      title: '考勤',
      dataIndex: 'acronym',
      key: 'acronym',
    }, {
      title: '操作',
      key: 'operation',
      // width: 80,
      render: (text, record) => (
        <DropMenu>
          <Menu onClick={({ key }) => handleMenuClick(key, record)}>   
            {addDeletePower && <Menu.Item key={DELETE}>退课</Menu.Item>}
            {otherPower && <Menu.Item key={UPDATE}>评价</Menu.Item>}
            {otherPower && <Menu.Item key={ADD}>上传录音</Menu.Item>}
            {otherPower && <Menu.Item key={DETAIL}>查看反馈</Menu.Item>}
          </Menu>
        </DropMenu>
      ),
      // fixed: 'right'
    },
  ]

  return (
    <DataTable
      className={styles.table}
      scroll={{ x: 638 }}
      columns={columns}
      dataSource={list}
      loading={loading}
      pagination={false}
      size="small"
      rowKey={record => record.id}
    />
  )
}

List.propTypes = {
  lessonStudent: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  addDeletePower: PropTypes.bool.isRequired,
  otherPower: PropTypes.bool.isRequired,
  onDeleteItem: PropTypes.func.isRequired,
}

export default List
