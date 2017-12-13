import React, { Component } from 'react'
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

class Calendar extends Component {
  static propTypes = {
    lessonCalendar: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    onNavigate: PropTypes.func.isRequired,
  }

  handleViews = (view) => {
    console.log(view)
  }

  handleNavigate = (date, curView, curNavigate) => {
    const { onNavigate } = this.props
    const momentDate = moment(date)

    if (curView === 'month' || curView === 'agenda') {
      // 加载当前月的数据
      onNavigate({
        available: momentDate.startOf('month').format('X'),
        deadline: momentDate.endOf('month').format('X'),
      })
    } else if (curView === 'day') {
      if ((momentDate.date() === 1 && curNavigate === 'NEXT') // 加载后一个月的数据
        || (momentDate.date() === momentDate.daysInMonth() && curNavigate === 'PREV')) { // 加载前一个月的数据
        onNavigate({
          available: momentDate.startOf('month').format('X'),
          deadline: momentDate.endOf('month').format('X'),
        })
      }
    } else if (curView === 'week') {
      const daysInMonth = momentDate.daysInMonth()
      const curDate = momentDate.date()
      if (curNavigate === 'PREV' && curDate < 7) {
        onNavigate({
          available: momentDate.subtract(1, 'month').startOf('month').format('X'),
          deadline: momentDate.subtract(1, 'month').endOf('month').format('X'),
        })
      } else if (curNavigate === 'NEXT' && daysInMonth - curDate < 7) {
        onNavigate({
          available: momentDate.add(1, 'month').startOf('month').format('X'),
          deadline: momentDate.add(1, 'month').endOf('month').format('X'),
        })
      }
    }
  }

  render () {
    const { lessonCalendar: { lessons }, loading } = this.props

    return (
      <Spin spinning={loading} size="large">
        <BigCalendar
          className={styles.calendar_box}
          events={lessons}
          views={allViews}
          step={30}
          defaultDate={new Date()}
          onView={this.handleViews}
          onNavigate={this.handleNavigate}
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
}

export default Calendar
