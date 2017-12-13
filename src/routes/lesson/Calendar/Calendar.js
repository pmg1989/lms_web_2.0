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
  const handleViews = (view) => {
    console.log(view)
  }

  const getDates = (date) => {
    const start = (moment(date).date(1).isoWeekday()) % 7 // 当前月份的第一天是周几
    const end = moment(date).daysInMonth() // 当前月份共有多少天
    let dates = []
    for (let i = 1; i < start; i += 1) {
      dates.push(0)
    }
    for (let i = 0; i < end; i += 1) {
      dates.push((i + 1))
    }
    if (dates.length % 7 > 0) {
      const padRight = 7 - (dates.length % 7)
      for (let i = 0; i < padRight; i += 1) {
        dates.push(0)
      }
    }
    return dates
  }

  const getDicWeek = (dates) => {
    return dates.reduce((dic, date, index) => {
      const key = Math.floor(index / 7)
      if (!dic[key]) {
        dic[key] = []
      }
      dic[key].push(date)
      return dic
    }, {})
  }

  const handleNavigate = (date, curView, curNavigate) => {
    // console.log(date, curView, curNavigate)
    if (curView === 'month') {
      // 加载当前月的数据
      onNavigate({
        available: moment(date).startOf('month').format('X'),
        deadline: moment(date).endOf('month').format('X'),
      })
    } else if (curView === 'day') {
      if ((moment(date).date() === 1 && curNavigate === 'NEXT') // 加载后一个月的数据
       || (moment(date).date() === moment(date).daysInMonth() && curNavigate === 'PREV')) { // 加载前一个月的数据
        onNavigate({
          available: moment(date).startOf('month').format('X'),
          deadline: moment(date).endOf('month').format('X'),
        })
      }
    } else if (curView === 'week') {
      const dates = getDates(date)
      const dicWeek = getDicWeek(dates)
      const curDate = moment(date).date()
      const curWeek = dicWeek[Object.keys(dicWeek).find(cur => dicWeek[cur].includes(curDate))]
      console.log(curWeek, curDate)
      if (curWeek[0] > curWeek[6] || curWeek[0] <= 0 || curWeek[6] === moment(date).daysInMonth()) {
        onNavigate({
          available: moment(date).startOf('month').format('X'),
          deadline: moment(date).endOf('month').format('X'),
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
        onView={handleViews}
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
