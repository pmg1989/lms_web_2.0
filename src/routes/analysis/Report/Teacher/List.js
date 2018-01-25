import React from 'react'
import PropTypes from 'prop-types'
import { DataTable } from 'components'
import styles from './List.less'

function List ({
  teacher: {
    searchQuery,
    list,
    pagination,
  },
  loading,
  onPageChange,
}) {
  const columns = [
    {
      title: '老师姓名',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    }, {
      title: '等级',
      dataIndex: 'teacher_level',
      key: 'teacher_level',
      sorter: (a, b) => a.teacher_level.localeCompare(b.teacher_level),
    }, {
      title: '类别',
      dataIndex: 'teacher_category',
      key: 'teacher_category',
      sorter: (a, b) => a.teacher_category.localeCompare(b.teacher_category),
    }, {
      title: '科目',
      dataIndex: 'teacher_subject',
      key: 'teacher_subject',
      sorter: (a, b) => a.teacher_subject.localeCompare(b.teacher_subject),
    }, {
      title: '休息日',
      dataIndex: 'day_off',
      key: 'day_off',
      sorter: (a, b) => a.day_off - b.day_off,
    }, {
      title: '保底课时',
      dataIndex: 'monthly',
      key: 'monthly',
      sorter: (a, b) => a.monthly - b.monthly,
    }, {
      title: '请假天数',
      dataIndex: 'leave_days',
      key: 'leave_days',
      sorter: (a, b) => a.leave_days - b.leave_days,
    },
    {
      title: '专业课',
      dataIndex: 'profession',
      key: 'profession',
      sorter: (a, b) => a.profession - b.profession,
    },
    {
      title: '交流课',
      dataIndex: 'jl',
      key: 'jl',
      sorter: (a, b) => a.jl - b.jl,
    },
    {
      title: '互动课',
      dataIndex: 'hd',
      key: 'hd',
      sorter: (a, b) => a.hd - b.hd,
    },
    {
      title: '代课数',
      dataIndex: 'substituter',
      key: 'substituter',
      sorter: (a, b) => a.substituter - b.substituter,
    },
    {
      title: '被代课数',
      dataIndex: 'substitutee',
      key: 'substitutee',
      sorter: (a, b) => a.substitutee - b.substitutee,
    },
    {
      title: '总课时',
      dataIndex: 'all',
      key: 'all',
      sorter: (a, b) => a.all - b.all,
    },
  ]

  let total = pagination.total

  const getFilterList = () => {
    const { field, keyword, current, pageSize } = searchQuery
    const currentPage = current || pagination.current
    const sizePage = pageSize || pagination.pageSize

    if (field) {
      const filterTotalList = list.filter((item) => {
        const hasKeyWords = keyword ? item[field].includes(decodeURI(keyword)) : true
        return hasKeyWords
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
    loading,
    className: styles.table,
    pagination: { ...pagination, total },
    onPageChange,
    rowKey: record => record.teacherid,
  }

  return (
    <DataTable {...tableProps} />
  )
}

List.propTypes = {
  loading: PropTypes.bool.isRequired,
  teacher: PropTypes.object.isRequired,
  onPageChange: PropTypes.func.isRequired,
}

export default List
