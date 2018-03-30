import React from 'react'
import PropTypes from 'prop-types'
import { Menu } from 'antd'
import moment from 'moment'
import { DataTable, DropMenu } from 'components'
import { DETAIL, UPDATE } from 'constants/options'
import { isMobile } from 'utils'
import styles from './List.less'

const statusDic = {
  NORMAL: '',
  FREEZING: '（即将冻结）',
  FROZEN: '（已冻结）',
}

function List ({
  accountUser: {
    searchQuery,
    list,
    pagination,
  },
  schools,
  loading,
  onPageChange,
  detailPower,
  isTeacher,
  onDetailItem,
  onFreezeItem,
}) {
  const handleMenuClick = (key, record) => {
    return {
      [DETAIL]: onDetailItem,
      [UPDATE]: onFreezeItem,
    }[key](record)
  }

  const columns = [
    {
      title: '真实姓名',
      dataIndex: 'firstname',
      key: 'firstname',
      sorter: (a, b) => a.firstname.localeCompare(b.firstname),
      render: (firstname, record) => (
        <span>{firstname} {statusDic[record.student_contract_status]}</span>
      ),
    }, {
      title: isTeacher ? '用户名' : '手机号',
      dataIndex: isTeacher ? 'username' : 'phone2',
      key: isTeacher ? 'username' : 'phone2',
    }, {
      title: '学号',
      dataIndex: 'idnumber',
      key: 'idnumber',
      sorter: (a, b) => a.idnumber.localeCompare(b.idnumber),
    }, {
      title: '校区',
      dataIndex: 'school',
      key: 'school',
      render: school => <span>{schools.find(item => item.school === school).name}</span>,
    }, {
      title: '加入时间',
      dataIndex: 'timecreated',
      key: 'timecreated',
      render: timecreated => (<span>{moment.unix(timecreated).format('YYYY-MM-DD HH:mm')}</span>),
      sorter: (a, b) => a.timecreated - b.timecreated,
    }, {
      title: '操作',
      key: 'operation',
      // width: 80,
      render: (text, record) => (
        <DropMenu>
          <Menu onClick={({ key }) => handleMenuClick(key, record)}>
            {detailPower && <Menu.Item key={DETAIL}>查看</Menu.Item>}
            {detailPower && record.student_contract_status !== 'NORMAL' && <Menu.Item key={UPDATE}>查看冻结信息</Menu.Item>}
          </Menu>
        </DropMenu>
      ),
      // fixed: 'right'
    },
  ]

  let total = pagination.total

  const getFilterList = () => {
    const { field, keyword, hasTeacher, current, pageSize } = searchQuery
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
      loading={loading}
      pagination={{ ...pagination, total }}
      onPageChange={onPageChange}
      scroll={{ x: isMobile() ? 600 : 1200 }}
      rowKey={record => record.id}
    />
  )
}

List.propTypes = {
  accountUser: PropTypes.object.isRequired,
  schools: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  detailPower: PropTypes.bool.isRequired,
  isTeacher: PropTypes.bool.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onDetailItem: PropTypes.func.isRequired,
  onFreezeItem: PropTypes.func.isRequired,
}

export default List
