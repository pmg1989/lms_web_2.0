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
    <Link to={`/lesson/detail?lessonid=${event.id}`} className={styles.title_box}>
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
    <Link to={`/lesson/detail?lessonid=${event.id}`} className={classnames(styles.title_box, styles.dark)}>
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
    loading: PropTypes.bool,
    onNavigate: PropTypes.func.isRequired,
  }

  state = {
    weekClicked: false, // 首次查看week信息时需要验证当前时间是否需要上个月/下个月的获取
    dicMonth: {
      [moment().format('YYYY-MM')]: true,
    }, // 缓存获取过的月份数据
  }

  handleViews = (view) => {
    if (view === 'week' && !this.state.weekClicked) {
      this.setState({ weekClicked: true })
      const momentDate = moment()
      const daysInMonth = momentDate.daysInMonth()
      const curDate = momentDate.date()
      if (curDate < 7) {
        this.props.onNavigate({
          available: momentDate.subtract(1, 'month').startOf('month').format('X'),
          deadline: momentDate.subtract(1, 'month').endOf('month').format('X'),
        })
      } else if (daysInMonth - curDate < 7) {
        this.props.onNavigate({
          available: momentDate.add(1, 'month').startOf('month').format('X'),
          deadline: momentDate.add(1, 'month').endOf('month').format('X'),
        })
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
    const { lessonCalendar: { lessons, isPostBack }, loading } = this.props

    return (
      <Spin spinning={loading} size="large">
        <div className={styles.calendar_container}>
          {!isPostBack &&
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
          }
        </div>
      </Spin>
    )
  }
}

export default Calendar
