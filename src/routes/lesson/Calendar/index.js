import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import classnames from 'classnames'
import Search from './Search'
import Calendar from './Calendar'
import styles from './Calendar.less'

const namespace = 'lessonCalendar'

function CalendarHome ({ dispatch, lessonCalendar, loading, commonModel }) {
  const searchProps = {
    searchQuery: lessonCalendar.searchQuery,
    schools: commonModel.schools,
    categorys: commonModel.categorys,
    teachersDic: commonModel.teachersDic,
    onSearch (fieldsValue) {
      dispatch({
        type: `${namespace}/getLessons`,
        payload: { ...fieldsValue, needMerge: false },
      })
    },
  }

  const calendarProps = {
    loading: loading.effects[`${namespace}/getLessons`],
    lessonCalendar,
    onNavigate (query) {
      dispatch({
        type: `${namespace}/getLessons`,
        payload: { ...query, needMerge: true },
      })
    },
    onResetLessons (available) {
      dispatch({
        type: `${namespace}/resetLessons`,
        payload: { available },
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
  commonModel: PropTypes.object.isRequired,
}

function mapStateToProps ({ lessonCalendar, loading, commonModel }) {
  return { lessonCalendar, loading, commonModel }
}

export default connect(mapStateToProps)(CalendarHome)
