import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Tag, Modal } from 'antd'
import moment from 'moment'
import { DataTable, DropMenu } from 'components'
import { getRoleName, getCategory, getSubject } from 'utils/dictionary'
import { UPDATE, DETAIL, RESIGN, LEAVE } from 'constants/options'
import styles from './List.less'

const confirm = Modal.confirm

function List ({
  accountAdmin: {
    searchQuery,
    schools,
    list,
    pagination,
  },
  loading,
  onPageChange,
  updatePower,
  detailPower,
  resignPower,
  leavePower,
  onEditItem,
  onDetailItem,
  onResignItem,
  onLeaveItem,
}) {
  const handleResignItem = (record) => {
    confirm({
      title: `您确定要${record.suspended === 1 ? '重新入职' : '离职'}${record.firstname}吗?`,
      onOk () {
        onResignItem(record)
      },
    })
  }

  const handleLeaveItem = (record) => {
    if (record.teacher_status === 'normal') {
      onLeaveItem(record)
    } else {
      confirm({
        title: `您确定要取消${record.firstname}的请假吗?`,
        onOk () {
          onLeaveItem(record)
        },
      })
    }
  }

  const handleMenuClick = (key, record) => {
    return {
      [UPDATE]: onEditItem,
      [DETAIL]: onDetailItem,
      [RESIGN]: handleResignItem,
      [LEAVE]: handleLeaveItem,
    }[key](record)
  }

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    }, {
      title: '真实姓名',
      dataIndex: 'firstname',
      key: 'firstname',
    }, {
      title: '手机号',
      dataIndex: 'phone2',
      key: 'phone2',
    }, {
      title: '校区',
      dataIndex: 'school',
      key: 'school',
      render: school => <span>{schools.find(item => item.school === school).name}</span>,
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
      dataIndex: 'rolename',
      key: 'rolename',
      render: roleName => <span>{getRoleName(roleName)}</span>,
    }, {
      title: '请假状态',
      dataIndex: 'teacher_status',
      key: 'teacher_status',
      render: (status, record) => (
        <span>{
          status !== 'leave' ? '正常' : <span><Tag color="#87d068">请假</Tag><br />{moment.unix(record.teacher_leave_available).format('YYYY-MM-DD')}<br />~{moment.unix(record.teacher_leave_deadline).format('YYYY-MM-DD')}</span>
        }</span>
      ),
    }, {
      title: '在职状态',
      dataIndex: 'suspended',
      key: 'suspended',
      render: suspended => <span>{suspended === 1 ? <Tag color="red">已离职</Tag> : '在职'}</span>,
    }, {
      title: '加入时间',
      dataIndex: 'timecreated',
      key: 'timecreated',
      render: timecreated => (<span>{moment.unix(timecreated).format('YYYY-MM-DD HH:mm')}</span>),
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
    const { field, keyword, rolename, category, subject, current, pageSize } = searchQuery
    const currentPage = current || pagination.current
    const sizePage = pageSize || pagination.pageSize

    if (field || rolename || category || subject) {
      const filterTotalList = list.filter((item) => {
        const hasRoleName = rolename ? item.rolename === rolename : true
        const hasCategory = category ? item.teacher_category === category : true
        const hasSubject = subject ? item.teacher_subject === subject : true
        const hasKeyWords = keyword ? item[field].includes(decodeURI(keyword)) : true
        return hasRoleName && hasCategory && hasSubject && hasKeyWords
      })
      total = filterTotalList.length
      const filterList = filterTotalList.slice((currentPage - 1) * (sizePage), currentPage * sizePage)
      return filterList
    }
    return list
  }

  const tableProps = {
    dataSource: getFilterList(),
    columns,
    loading: loading.effects['accountAdmin/query'],
    className: styles.table,
    pagination: { ...pagination, total },
    onPageChange,
    rowKey: record => record.id,
  }

  return (
    <DataTable {...tableProps} />
  )
}

List.propTypes = {
  loading: PropTypes.object.isRequired,
  accountAdmin: PropTypes.object.isRequired,
  updatePower: PropTypes.bool.isRequired,
  detailPower: PropTypes.bool.isRequired,
  resignPower: PropTypes.bool.isRequired,
  leavePower: PropTypes.bool.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onEditItem: PropTypes.func.isRequired,
  onDetailItem: PropTypes.func.isRequired,
  onResignItem: PropTypes.func.isRequired,
  onLeaveItem: PropTypes.func.isRequired,
}

export default List
