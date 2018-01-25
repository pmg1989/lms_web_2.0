import React from 'react'
import PropTypes from 'prop-types'
import { DataTable } from 'components'
// import styles from './List.less'

function List ({
  lessonComplete: {
    searchQuery,
    list,
    pagination,
  },
  loading,
  onPageChange,
}) {
  const columns = [
    {
      title: '姓名',
      dataIndex: 'student_name',
      key: 'student_name',
      sorter: (a, b) => a.student_name.localeCompare(b.student_name),
    }, {
      title: '学号',
      dataIndex: 'student_idnumber',
      key: 'student_idnumber',
      sorter: (a, b) => a.student_idnumber.localeCompare(b.student_idnumber),
    }, {
      title: '课程名称',
      dataIndex: 'category_summary',
      key: 'category_summary',
      sorter: (a, b) => a.category_summary.localeCompare(b.category_summary),
    }, {
      title: '合同开始',
      dataIndex: 'contract_available',
      key: 'contract_available',
      sorter: (a, b) => a.contract_available.localeCompare(b.contract_available),
    }, {
      title: '合同结束',
      dataIndex: 'contract_deadline',
      key: 'contract_deadline',
      sorter: (a, b) => a.contract_deadline.localeCompare(b.contract_deadline),
    }, {
      title: '合同状态',
      dataIndex: 'due_note',
      key: 'due_note',
    }, {
      title: '合同进度月',
      dataIndex: 'contract_months',
      key: 'contract_months',
    },
    {
      title: '专业合同课时数',
      dataIndex: 'pro_constract_cnt',
      key: 'pro_constract_cnt',
    },
    {
      title: '专业已完成',
      dataIndex: 'pro_actual_attendcnt',
      key: 'pro_actual_attendcnt',
    },
    {
      title: '专业应上课时',
      dataIndex: 'pro_ideal_attendcnt',
      key: 'pro_ideal_attendcnt',
    },
    {
      title: '专业ontrack',
      dataIndex: 'pro_ontrack',
      key: 'pro_ontrack',
    },
    {
      title: '专业yes/no',
      dataIndex: 'pro_yesno',
      key: 'pro_yesno',
    },
    {
      title: '互动合同课时数',
      dataIndex: 'hd_constract_cnt',
      key: 'hd_constract_cnt',
    },
    {
      title: '互动已完成',
      dataIndex: 'hd_actual_attendcnt',
      key: 'hd_actual_attendcnt',
    },
    {
      title: '互动应上课时',
      dataIndex: 'hd_ideal_attendcnt',
      key: 'hd_ideal_attendcnt',
    },
    {
      title: '互动ontrack',
      dataIndex: 'hd_ontrack',
      key: 'hd_ontrack',
    },
    {
      title: '互动yes/no',
      dataIndex: 'hd_yesno',
      key: 'hd_yesno',
    },
    {
      title: '交流合同课时数',
      dataIndex: 'jl_constract_cnt',
      key: 'jl_constract_cnt',
    },
    {
      title: '交流已完成',
      dataIndex: 'jl_actual_attendcnt',
      key: 'jl_actual_attendcnt',
    },
    {
      title: '交流应上课时',
      dataIndex: 'jl_ideal_attendcnt',
      key: 'jl_ideal_attendcnt',
    },
    {
      title: '交流ontrack',
      dataIndex: 'jl_ontrack',
      key: 'jl_ontrack',
    },
    {
      title: '交流yes/no',
      dataIndex: 'jl_yesno',
      key: 'jl_yesno',
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
  lessonComplete: PropTypes.object.isRequired,
  onPageChange: PropTypes.func.isRequired,
}

export default List
