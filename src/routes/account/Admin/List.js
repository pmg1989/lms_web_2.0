import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Tag } from 'antd'
import moment from 'moment'
import { DataTable, DropMenu } from 'components'
import { getRoleName, getCategory, getSubject } from 'utils/dictionary'
import { UPDATE, DETAIL, RESIGN, LEAVE } from 'constants/options'
import styles from './List.less'

function List ({
  accountAdmin: {
    list,
    pagination,
  },
  location,
  loading,
  updatePower,
  detailPower,
  resignPower,
  leavePower,
  onEditItem,
  onDetailItem,
  onResignItem,
  onLeaveItem,
}) {
  const handleMenuClick = (key, record) => {
    return {
      [UPDATE]: onEditItem,
      [DETAIL]: onDetailItem,
      [RESIGN]: onResignItem,
      [LEAVE]: onLeaveItem,
    }[key](record)
  }

  const columns = [
    {
      title: '用户名',
      dataIndex: 'firstname',
      key: 'firstname',
    }, {
      title: '手机号',
      dataIndex: 'phone2',
      key: 'phone2',
    }, {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    }, {
      title: '类别',
      dataIndex: 'teacher_category',
      key: 'teacher_category',
      render: category => <span>{getCategory(category)}</span>,
    }, {
      title: '科目',
      dataIndex: 'teacher_subject',
      key: 'teacher_subject',
      render: subject => <span>{getSubject(subject)}</span>,
    }, {
      title: '角色',
      dataIndex: 'roleName',
      key: 'roleName',
      render: roleName => <span>{getRoleName(roleName)}</span>,
    }, {
      title: '加入时间',
      dataIndex: 'createTime',
      key: 'createTime',
    }, {
      title: '请假状态',
      dataIndex: 'teacher_status',
      key: 'teacher_status',
      render: (status, record) => (
        <span>{
          status === 'normal' ? '正常' : <span><Tag color="#87d068">请假</Tag><br />{moment.unix(record.teacher_leave_available).format('YYYY-MM-DD')}<br />~{moment.unix(record.teacher_leave_deadline).format('YYYY-MM-DD')}</span>
        }</span>
      ),
    }, {
      title: '在职状态',
      dataIndex: 'suspended',
      key: 'suspended',
      render: suspended => <span>{suspended === 1 ? <Tag color="red">已离职</Tag> : '在职'}</span>,
    }, {
      title: '操作',
      key: 'operation',
      // width: 100,
      render: (text, record) => (
        <DropMenu>
          <Menu onClick={({ key }) => handleMenuClick(key, record)}>
            {detailPower && <Menu.Item key={DETAIL}>查看</Menu.Item>}
            {updatePower && <Menu.Item key={UPDATE}>编辑</Menu.Item>}
            {leavePower && <Menu.Item key={LEAVE}>{record.teacher_status === 'normal' ? '请假' : '销假'}</Menu.Item>}
            {resignPower && <Menu.Item key={RESIGN}>{record.suspended === 1 ? '重新入职' : '离职'}</Menu.Item>}
          </Menu>
        </DropMenu>
      ),
      // fixed: 'right'
    },
  ]

  let total = pagination.total

  const getFilterList = () => {
    const { field, keyword, roleName, category, subject, current, pageSize } = location.query
    const currentPage = current || pagination.current
    const sizePage = pageSize || pagination.pageSize

    if (field || roleName || category || subject) {
      if (roleName) {
        list = list.filter(item => item.roleName === roleName)
      }
      if (category) {
        list = list.filter(item => item.teacher_category === category)
      }
      if (subject) {
        list = list.filter(item => item.teacher_subject === subject)
      }
      if (field) {
        list = list.filter(item => item[field].indexOf(decodeURI(keyword)) > -1)
      }
      total = list.length
      list = list.slice((currentPage - 1) * (sizePage), currentPage * sizePage)
      return list
    }
    return list
  }

  const tableProps = {
    dataSource: getFilterList(),
    columns,
    loading: loading.effects['accountAdmin/query'],
    className: styles.table,
    pagination: { ...pagination, total },
    rowKey: record => record.id,
  }

  return (
    <DataTable {...tableProps} />
  )
}

List.propTypes = {
  location: PropTypes.object.isRequired,
  loading: PropTypes.object.isRequired,
  accountAdmin: PropTypes.object.isRequired,
  updatePower: PropTypes.bool.isRequired,
  detailPower: PropTypes.bool.isRequired,
  resignPower: PropTypes.bool.isRequired,
  leavePower: PropTypes.bool.isRequired,
  onEditItem: PropTypes.func.isRequired,
  onDetailItem: PropTypes.func.isRequired,
  onResignItem: PropTypes.func.isRequired,
  onLeaveItem: PropTypes.func.isRequired,
}

export default List
