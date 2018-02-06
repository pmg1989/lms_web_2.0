import React, { Component } from 'react'
import PropTypes from 'prop-types'
import BigCalendar from 'react-big-calendar'
import { Spin, Tooltip } from 'antd'
import { Link } from 'dva/router'
import moment from 'moment'
import classnames from 'classnames'
import 'react-big-calendar/lib/less/styles.less'
import styles from './Calendar.less'

moment.locale('zh_CN')
BigCalendar.momentLocalizer(moment) // or globalizeLocalizer

const MonthEvent = ({ event }) => {
  const Title = (
    <div>
      {moment.unix(event.available).format('HH:mm')} -- {moment.unix(event.deadline).format('HH:mm')}<br />
      {event.category_summary}<br />老师: {event.teacher_alternatename}<br />教室: {event.classroom}
    </div>
  )

  return (
    <Tooltip title={Title} mouseLeaveDelay={0}>
      <Link to={`/lesson/update?lessonid=${event.id}`} className={styles.title_box}>
        <span className={`icon ${event.category}-${event.iconType}`} />
        <span className={styles.title}>{event.text}</span>
      </Link>
    </Tooltip>
  )
}

MonthEvent.propTypes = {
  event: PropTypes.object.isRequired,
}

const AgendaEvent = ({ event }) => {
  return (
    <Link to={`/lesson/update?lessonid=${event.id}`} className={classnames(styles.title_box, styles.dark)}>
      <span className={`icon ${event.category}-${event.iconType}`} />
      <span className={styles.title}>{`${event.teacher_alternatename} - ${event.category_summary} - ${event.classroom}教室`}</span>
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
    loading: PropTypes.bool,
    onPrev: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
    resetQuery: PropTypes.func.isRequired,
  }

  constructor (props) {
    super(props)
    const { lessonCalendar: { curDate } } = props
    this.state = {
      dicMonth: {
        [moment(curDate * 1000).format('YYYY-MM')]: true,
      }, // 缓存获取过的月份数据
    }
  }

  componentWillUnmount () {
    this.props.resetQuery()
  }

  handleNavigate = (date, curView, curNavigate) => {
    const { lessonCalendar: { searchQuery: { available, deadline, ...params } }, onPrev, onNext } = this.props
    const curMonth = moment(date).format('YYYY-MM')
    if (curNavigate === 'DATE') {
      // 点击 + more 按钮时，不做任何请求
      return
    }
    if (this.state.dicMonth[curMonth]) {
      return // 排除重复请求一些正在请求中的数据，防止重复渲染数据
    }
    const prevMonth = moment(date).subtract(1, 'month').startOf('month').format('X')
    const nextMonth = moment(date).add(2, 'months').startOf('month').format('X')
    if (prevMonth < available && nextMonth < deadline) {
      onPrev({
        ...params,
        available: prevMonth,
        deadline: available,
        curDate: moment(date).format('X'),
      })
    } else if (prevMonth > available && nextMonth > deadline) {
      onNext({
        ...params,
        available: deadline,
        deadline: nextMonth,
        curDate: moment(date).format('X'),
      })
    }
    this.setState(({ dicMonth }) => ({
      dicMonth: { ...dicMonth, [moment(date).format('YYYY-MM')]: true },
    }))
  }

  render () {
    const { lessonCalendar: { lessons, isPostBack, curDate }, loading } = this.props

    return (
      <Spin spinning={loading} size="large">
        <div className={styles.calendar_container}>
          {!isPostBack &&
            <BigCalendar
              className={styles.calendar_box}
              events={lessons}
              views={allViews}
              step={30}
              defaultDate={new Date(curDate * 1000)}
              onNavigate={this.handleNavigate}
              components={{
                event: MonthEvent,
                agenda: {
                  event: AgendaEvent,
                },
              }}
            />
          }
        </div>
      </Spin>
    )
  }
}

export default Calendar
