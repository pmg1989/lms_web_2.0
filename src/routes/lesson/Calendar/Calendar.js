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
      {event.category_summary}<br />老师: {event.alternatename}<br />教室: {event.classroom}
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
    onNavigate: PropTypes.func.isRequired,
    onResetLessons: PropTypes.func.isRequired,
  }

  state = {
    weekClicked: false, // 首次查看week信息时需要验证当前时间是否需要上个月/下个月的获取
    curDate: this.props.lessonCalendar.searchQuery.available,
    dicMonth: {
      [moment(this.props.lessonCalendar.searchQuery.available * 1000).format('YYYY-MM')]: true,
    }, // 缓存获取过的月份数据
  }

  componentWillUnmount () {
    this.props.onResetLessons(this.state.curDate)
  }

  handleCacheMonth = (momentDate) => {
    this.setState(({ dicMonth }) => ({ dicMonth: { ...dicMonth, [momentDate.format('YYYY-MM')]: true } }))
  }

  checkCacheMonth = (momentDate) => {
    return !this.state.dicMonth[momentDate.format('YYYY-MM')]
  }

  handleViews = (view) => {
    if (view === 'week' && !this.state.weekClicked) {
      const { lessonCalendar: { searchQuery: { available } } } = this.props
      const momentDate = moment(available * 1000)
      const daysInMonth = momentDate.daysInMonth()
      const curDate = momentDate.date()
      const prevMomentDate = moment(available * 1000).subtract(1, 'month')
      const nextMomentDate = moment(available * 1000).add(1, 'month')
      this.setState({ weekClicked: true, curDate: momentDate.format('X') })
      if (curDate < 7 && this.checkCacheMonth(prevMomentDate)) {
        this.props.onNavigate({
          available: prevMomentDate.startOf('month').format('X'),
          deadline: prevMomentDate.endOf('month').format('X'),
        })
        this.handleCacheMonth(prevMomentDate)
      } else if (daysInMonth - curDate < 7 && this.checkCacheMonth(nextMomentDate)) {
        this.props.onNavigate({
          available: nextMomentDate.startOf('month').format('X'),
          deadline: nextMomentDate.endOf('month').format('X'),
        })
        this.handleCacheMonth(nextMomentDate)
      }
    }
  }

  handleNavigate = (date, curView, curNavigate) => {
    const { onNavigate } = this.props
    const momentDate = moment(date)
    if (curNavigate === 'DATE') {
      // 点击 + more 按钮时，不做任何请求 
      return
    }
    this.setState({ curDate: momentDate.format('X') })
    if ((curView === 'month' || curView === 'agenda') && this.checkCacheMonth(momentDate)) {
      // 加载当前月的数据
      onNavigate({
        available: momentDate.startOf('month').format('X'),
        deadline: momentDate.endOf('month').format('X'),
      })
      this.handleCacheMonth(momentDate)
    } else if (curView === 'day' && this.checkCacheMonth(momentDate)) {
      if ((momentDate.date() === 1 && curNavigate === 'NEXT') // 加载后一个月的数据
        || (momentDate.date() === momentDate.daysInMonth() && curNavigate === 'PREV')) { // 加载前一个月的数据
        onNavigate({
          available: momentDate.startOf('month').format('X'),
          deadline: momentDate.endOf('month').format('X'),
        })
        this.handleCacheMonth(momentDate)
      }
    } else if (curView === 'week') {
      const daysInMonth = momentDate.daysInMonth()
      const curDate = momentDate.date()
      const prevMomentDate = moment(date).subtract(1, 'month')
      const nextMomentDate = moment(date).add(1, 'month')
      if (curNavigate === 'PREV' && curDate < 7 && this.checkCacheMonth(prevMomentDate)) {
        onNavigate({
          available: prevMomentDate.startOf('month').format('X'),
          deadline: prevMomentDate.endOf('month').format('X'),
        })
        this.handleCacheMonth(prevMomentDate)
      } else if (curNavigate === 'NEXT' && daysInMonth - curDate < 7 && this.checkCacheMonth(nextMomentDate)) {
        onNavigate({
          available: nextMomentDate.startOf('month').format('X'),
          deadline: nextMomentDate.endOf('month').format('X'),
        })
        this.handleCacheMonth(nextMomentDate)
      }
    }
  }

  render () {
    const { lessonCalendar: { lessons, searchQuery, isPostBack }, loading } = this.props

    return (
      <Spin spinning={loading} size="large">
        <div className={styles.calendar_container}>
          {!isPostBack &&
            <BigCalendar
              className={styles.calendar_box}
              events={lessons}
              views={allViews}
              step={30}
              defaultDate={new Date(searchQuery.available * 1000)}
              onView={this.handleViews}
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
