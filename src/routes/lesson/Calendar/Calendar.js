import React from 'react'
import PropTypes from 'prop-types'
import BigCalendar from 'react-big-calendar'
import { Spin } from 'antd'
import { Link } from 'dva/router'
import moment from 'moment'
import classnames from 'classnames'
import 'react-big-calendar/lib/less/styles.less'
import styles from './Calendar.less'

moment.locale('zh_CN')
BigCalendar.momentLocalizer(moment) // or globalizeLocalizer

const MonthEvent = ({ event }) => {
  return (
    <Link to={`/lesson/detail/${event.id}`} className={styles.title_box}>
      <span className={`icon ${event.category}-${event.iconType}`} />
      <span className={styles.title}>{event.title}</span>
    </Link>
  )
}

MonthEvent.propTypes = {
  event: PropTypes.object.isRequired,
}

const AgendaEvent = ({ event }) => {
  return (
    <Link to={`/lesson/detail/${event.id}`} className={classnames(styles.title_box, styles.dark)}>
      <span className={`icon ${event.category}-${event.iconType}`} />
      <span className={styles.title}>{`${event.teacher} - ${event.category_summary} - ${event.classroom}教室`}</span>
    </Link>
  )
}

AgendaEvent.propTypes = {
  event: PropTypes.object.isRequired,
}

// const allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k])
const allViews = ['month', 'week', 'day', 'agenda']

const Calendar = ({
  lessonCalendar: {
    lessons,
  },
  loading,
  onNavigate,
}) => {
  const handleNavigate = (date, curView, curNavigate) => {
    // console.log(date, curView, curNavigate)
    if (curView === 'month') {
      // 加载当前月的数据
      onNavigate({
        available: moment(date).startOf('month').format('X'),
        deadline: moment(date).endOf('month').format('X'),
      })
    } else if (curView === 'day') {
      if (moment(date).date() === 1 && curNavigate === 'NEXT') {
        // 预加载前一个月的数据
        onNavigate({
          available: moment(date).subtract(1, 'month').startOf('month').format('X'),
          deadline: moment(date).subtract(1, 'month').endOf('month').format('X'),
        })
      } else if (moment(date).date() === moment(date).daysInMonth() && curNavigate === 'NEXT') {
        // 预加载后一个月的数据
        onNavigate({
          available: moment(date).add(1, 'month').startOf('month').format('X'),
          deadline: moment(date).add(1, 'month').endOf('month').format('X'),
        })
      }
    }
  }

  return (
    <Spin spinning={loading} size="large">
      <BigCalendar
        className={styles.calendar_box}
        events={lessons}
        views={allViews}
        step={30}
        defaultDate={new Date()}
        onNavigate={handleNavigate}
        components={{
          event: MonthEvent,
          agenda: {
            event: AgendaEvent,
          },
        }}
      />
    </Spin>
  )
}

Calendar.propTypes = {
  lessonCalendar: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  onNavigate: PropTypes.func.isRequired,
}

export default Calendar
