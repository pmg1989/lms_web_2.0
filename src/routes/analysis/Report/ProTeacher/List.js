import React from 'react'
import PropTypes from 'prop-types'
import { DataTable } from 'components'
// import styles from './List.less'

function List ({
  proTeacher: {
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
      title: '科目',
      dataIndex: 'teacher_subject',
      key: 'teacher_subject',
      sorter: (a, b) => a.teacher_subject.localeCompare(b.teacher_subject),
    }, {
      title: '一阶段合同数',
      dataIndex: 'stage_1',
      key: 'stage_1',
    }, {
      title: '一阶段合同占比',
      dataIndex: 'stage_1_percent',
      key: 'stage_1_percent',
    }, {
      title: '一阶段精品课时数',
      dataIndex: 'stage_1_jp',
      key: 'stage_1_jp',
    }, {
      title: '一阶段精品课时占比',
      dataIndex: 'stage_1_jp_percent',
      key: 'stage_1_jp_percent',
    },
    {
      title: '一阶段VIP课时数',
      dataIndex: 'stage_1_vip',
      key: 'stage_1_vip',
    },
    {
      title: '一阶段VIP课时占比',
      dataIndex: 'stage_1_vip_percent',
      key: 'stage_1_vip_percent',
    },
    {
      title: '二阶段合同数',
      dataIndex: 'stage_2',
      key: 'stage_2',
    },
    {
      title: '二阶段合同占比',
      dataIndex: 'stage_2_percent',
      key: 'stage_2_percent',
    },
    {
      title: '二阶段精品课时数',
      dataIndex: 'stage_2_jp',
      key: 'stage_2_jp',
    },
    {
      title: '二阶段精品课时占比',
      dataIndex: 'stage_2_jp_percent',
      key: 'stage_2_jp_percent',
    },
    {
      title: '二阶段VIP课时数',
      dataIndex: 'stage_2_vip',
      key: 'stage_2_vip',
    },
    {
      title: '二阶段VIP课时占比',
      dataIndex: 'stage_2_vip_percent',
      key: 'stage_2_vip_percent',
    },
    {
      title: '三阶段合同数',
      dataIndex: 'stage_3',
      key: 'stage_3',
    },
    {
      title: '三阶段合同占比',
      dataIndex: 'stage_3_percent',
      key: 'stage_3_percent',
    },
    {
      title: '三阶段精品课时数',
      dataIndex: 'stage_3_jp',
      key: 'stage_3_jp',
    },
    {
      title: '三阶段精品课时占比',
      dataIndex: 'stage_3_jp_percent',
      key: 'stage_3_jp_percent',
    },
    {
      title: '三阶段VIP课时数',
      dataIndex: 'stage_3_vip',
      key: 'stage_3_vip',
    },
    {
      title: '三阶段VIP课时占比',
      dataIndex: 'stage_3_vip_percent',
      key: 'stage_3_vip_percent',
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
    animate: false,
    dataSource: getFilterList(),
    columns,
    loading,
    // className: styles.table,
    pagination: { ...pagination, total },
    onPageChange,
    rowKey: (record, index) => index,
  }

  return (
    <DataTable {...tableProps} />
  )
}

List.propTypes = {
  loading: PropTypes.bool,
  proTeacher: PropTypes.object.isRequired,
  onPageChange: PropTypes.func.isRequired,
}

export default List
