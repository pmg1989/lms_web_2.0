import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import Calendar from './Calendar'


function Dashboard ({ dashboard }) {
  console.log(dashboard)
  return (
    <div className="content-inner">
      <Calendar />
    </div>
  )
}

Dashboard.propTypes = {
  dashboard: PropTypes.object.isRequired,
}

export default connect(({ dashboard }) => ({ dashboard }))(Dashboard)
