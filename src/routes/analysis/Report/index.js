import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'

const namespace = 'analysisReport'

function Report ({ analysisReport, loading }) {
  console.log(namespace, analysisReport, loading)
  return (
    <div className="content-inner">
      analysisReport
    </div>
  )
}

Report.propTypes = {
  analysisReport: PropTypes.object.isRequired,
  loading: PropTypes.object.isRequired,
}

function mapStateToProps ({ analysisReport, loading }) {
  return { analysisReport, loading }
}

export default connect(mapStateToProps)(Report)
