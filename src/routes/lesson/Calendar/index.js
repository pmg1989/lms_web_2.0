import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import Calendar from './Calendar'

const namespace = 'lessonCalendar'

function CalendarHome ({ dispatch, lessonCalendar, loading }) {
  const calendarProps = {
    loading: loading.effects[`${namespace}/getLessons`],
    lessonCalendar,
    onChangeView (view) {
      dispatch({
        type: `${namespace}/changeView`,
        payload: { view },
      })
    },
    onNavigate (query) {
      dispatch({
        type: `${namespace}/getLessons`,
        payload: query,
      })
    },
  }

  return (
    <div className="content-inner">
      <Calendar {...calendarProps} />
    </div>
  )
}

CalendarHome.propTypes = {
  dispatch: PropTypes.func.isRequired,
  lessonCalendar: PropTypes.object.isRequired,
  loading: PropTypes.object.isRequired,
}

function mapStateToProps ({ lessonCalendar, loading }) {
  return { lessonCalendar, loading }
}

export default connect(mapStateToProps)(CalendarHome)
