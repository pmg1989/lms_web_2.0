import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import styles from './index.less'


function Dashboard ({ dashboard }) {
  console.log(dashboard)
  return (
    <div>
      dashboard
    </div>
  )
}

Dashboard.propTypes = {
  dashboard: PropTypes.object.isRequired,
}

export default connect(({ dashboard }) => ({ dashboard }))(Dashboard)
