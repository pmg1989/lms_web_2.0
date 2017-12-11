import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import Calendar from './Calendar'


function Dashboard ({ dashboard, loading }) {
  const calendarProps = {
    loading: loading.effects['dashboard/getLessons'],
    lessons: dashboard.lessons,
  }

  return (
    <div className="content-inner">
      <Calendar {...calendarProps} />
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
