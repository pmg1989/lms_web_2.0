import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import List from './List'
import Search from './Search'

const namespace = 'analysisReport'

function Report ({ dispatch, analysisReport, loading, commonModel }) {
  const searchProps = {
    schools: commonModel.schools,
    onSearch (fieldsValue) {
      dispatch({
        type: `${namespace}/queryTeacherReport`,
        payload: { current: 1, ...fieldsValue },
      })
    },
  }

  const listProps = {
    teacher: analysisReport.teacher,
    loading: loading.effects[`${namespace}/queryTeacherReport`],
    onPageChange (fieldsValue) {
      dispatch({
        type: `${namespace}/queryTeacherReport`,
        payload: { ...fieldsValue, isPostBack: false },
      })
    },
  }

  return (
    <div className="content-inner">
      <Search {...searchProps} />
      <List {...listProps} />
    </div>
  )
}

Report.propTypes = {
  dispatch: PropTypes.func,
  curPowers: PropTypes.array,
  analysisReport: PropTypes.object,
  loading: PropTypes.object.isRequired,
  commonModel: PropTypes.object.isRequired,
}

function mapStateToProps ({ analysisReport, loading, commonModel }) {
  return { analysisReport, loading, commonModel }
}

export default connect(mapStateToProps)(Report)
