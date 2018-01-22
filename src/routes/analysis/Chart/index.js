import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'

const namespace = 'analysisChart'

function Chart ({ analysisChart, loading }) {
  console.log(namespace, analysisChart, loading)
  return (
    <div className="content-inner">
      analysisChart
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
