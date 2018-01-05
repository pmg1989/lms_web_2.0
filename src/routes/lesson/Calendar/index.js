import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import classnames from 'classnames'
import Search from './Search'
import Calendar from './Calendar'
import styles from './Calendar.less'

const namespace = 'lessonCalendar'

function CalendarHome ({ dispatch, lessonCalendar, loading }) {
  const searchProps = {
    searchQuery: lessonCalendar.searchQuery,
    schools: lessonCalendar.schools,
    categorys: lessonCalendar.categorys,
    teachersDic: lessonCalendar.teachersDic,
    onSearch (fieldsValue) {
      dispatch({
        type: `${namespace}/getLessons`,
        payload: fieldsValue,
      })
    },
  }

  const calendarProps = {
    loading: loading.effects[`${namespace}/getLessons`],
    lessonCalendar,
    onNavigate (query) {
      dispatch({
        type: `${namespace}/getLessons`,
        payload: query,
      })
    },
    onResetLessons () {
      dispatch({
        type: `${namespace}/resetLessons`,
      })
    },
  }

  return (
    <div className={classnames('content-inner', styles.inner_box)}>
      <Search {...searchProps} />
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
