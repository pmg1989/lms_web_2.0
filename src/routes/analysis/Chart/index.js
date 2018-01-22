import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import Lessons from './Lessons'

const namespace = 'analysisChart'

function Chart ({ analysisChart, loading }) {
  // console.log(namespace, analysisChart, loading)
  const lessonsProps = {
    loading: loading.effects[`${namespace}/queryChart`],
    lessons: analysisChart.lessons,
  }

  return (
    <div className="content-inner">
      <Lessons {...lessonsProps} />
    </div>
  )
}

Chart.propTypes = {
  analysisChart: PropTypes.object.isRequired,
  loading: PropTypes.object.isRequired,
}

function mapStateToProps ({ analysisChart, loading }) {
  return { analysisChart, loading }
}

export default connect(mapStateToProps)(Chart)
