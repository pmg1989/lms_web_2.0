import React from 'react'
import PropTypes from 'prop-types'
import BigCalendar from 'react-big-calendar'
import { Spin } from 'antd'
import moment from 'moment'
import 'react-big-calendar/lib/less/styles.less'
import styles from './Calendar.less'

moment.locale('zh_CN')
BigCalendar.momentLocalizer(moment) // or globalizeLocalizer

const allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k])

const Calendar = ({ lessons, loading }) => {
  return (
    <Spin spinning={loading} size="large">
      {!loading &&
        <BigCalendar
          className={styles.calendar_box}
          events={lessons}
          views={allViews}
          step={60}
          defaultDate={new Date()}
        />
      }
    </Spin>
  )
}

Calendar.propTypes = {
  lessons: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
}

export default Calendar
