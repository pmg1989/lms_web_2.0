import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Card } from 'antd'
import TeacherSearch from './TeacherSearch'
import TeacherChart from './TeacherChart'
import LessonCompleteChart from './LessonCompleteChart'
import LessonCompleteSearch from './LessonCompleteSearch'

const namespace = 'analysisChart'

function Chart ({ dispatch, analysisChart, loading, commonModel: { schools, teachersDic } }) {
  const teacherSearchProps = {
    schools,
    teachersDic,
    data: analysisChart.teacher.data,
    searchQuery: analysisChart.teacher.searchQuery,
    onQuery (fieldsValue) {
      dispatch({
        type: `${namespace}/queryTeacherChart`,
        payload: fieldsValue,
      })
    },
  }

  const teacherChartProps = {
    loading: loading.effects[`${namespace}/queryTeacherChart`],
    teacher: analysisChart.teacher,
  }

  const lessonCompleteSearchProps = {
    schools,
    data: analysisChart.lessonComplete.data,
    searchQuery: analysisChart.lessonComplete.searchQuery,
    onQuery (fieldsValue) {
      dispatch({
        type: `${namespace}/queryLessonComplete`,
        payload: fieldsValue,
      })
    },
  }

  const lessonCompleteChartProps = {
    loading: loading.effects[`${namespace}/queryLessonComplete`],
    lessonComplete: analysisChart.lessonComplete,
  }

  return (
    <div className="content-inner">
      <Card>
        <TeacherSearch {...teacherSearchProps} />
        <TeacherChart {...teacherChartProps} />
      </Card>
      <Card>
        <LessonCompleteSearch {...lessonCompleteSearchProps} />
        <LessonCompleteChart {...lessonCompleteChartProps} />
      </Card>
    </div>
  )
}

Chart.propTypes = {
  dispatch: PropTypes.func.isRequired,
  analysisChart: PropTypes.object.isRequired,
  loading: PropTypes.object.isRequired,
  commonModel: PropTypes.object.isRequired,
}

function mapStateToProps ({ analysisChart, loading, commonModel }) {
  return { analysisChart, loading, commonModel }
}

export default connect(mapStateToProps)(Chart)
