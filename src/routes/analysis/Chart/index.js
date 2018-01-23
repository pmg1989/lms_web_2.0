import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Card } from 'antd'
import LessonSearch from './LessonSearch'
import LessonChart from './LessonChart'

const namespace = 'analysisChart'

function Chart ({ dispatch, analysisChart, loading, commonModel: { schools, teachersDic } }) {
  const lessonSearchProps = {
    schools,
    teachersDic,
    onQuery (fieldsValue) {
      dispatch({
        type: `${namespace}/queryTeacherLessonsChart`,
        payload: fieldsValue,
      })
    },
  }

  const lessonChartProps = {
    loading: loading.effects[`${namespace}/queryTeacherLessonsChart`],
    lessons: analysisChart.lessons,
  }

  return (
    <div className="content-inner">
      <Card>
        <LessonSearch {...lessonSearchProps} />
        <LessonChart {...lessonChartProps} />
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
