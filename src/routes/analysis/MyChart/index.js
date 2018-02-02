import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Card } from 'antd'
import TeacherChart from './TeacherChart'

const namespace = 'analysisMyChart'

function MyChart ({ analysisMyChart, loading }) {
  const teacherChartProps = {
    loading: loading.effects[`${namespace}/queryTeacherChart`],
    teacher: analysisMyChart.teacher,
  }

  return (
    <div className="content-inner">
      <Card>
        <TeacherChart {...teacherChartProps} />
      </Card>
    </div>
  )
}

MyChart.propTypes = {
  analysisMyChart: PropTypes.object.isRequired,
  loading: PropTypes.object.isRequired,
}

function mapStateToProps ({ analysisMyChart, loading }) {
  return { analysisMyChart, loading }
}

export default connect(mapStateToProps)(MyChart)
