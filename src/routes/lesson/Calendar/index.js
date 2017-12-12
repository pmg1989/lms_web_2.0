import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import Calendar from './Calendar'


function CalendarHome ({ lessonCalendar, loading }) {
  const calendarProps = {
    loading: loading.effects['lessonCalendar/getLessons'],
    lessons: lessonCalendar.lessons,
  }

  return (
    <div className="content-inner">
      <Calendar {...calendarProps} />
    </div>
  )
}

CalendarHome.propTypes = {
  lessonCalendar: PropTypes.object.isRequired,
  loading: PropTypes.object.isRequired,
}

function mapStateToProps ({ lessonCalendar, loading }) {
  return { lessonCalendar, loading }
}

export default connect(mapStateToProps)(CalendarHome)
