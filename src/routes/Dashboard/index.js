import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'

function Dashboard ({ dashboard, loading }) {
  console.log(dashboard, loading)

  return (
    <div className="content-inner">
      dashboard
    </div>
  )
}

Dashboard.propTypes = {
  dashboard: PropTypes.object.isRequired,
  loading: PropTypes.object.isRequired,
}

function mapStateToProps ({ dashboard, loading }) {
  return { dashboard, loading }
}

export default connect(mapStateToProps)(Dashboard)
