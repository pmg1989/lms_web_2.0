import React from 'react'
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/less/styles.less'
import styles from './Calendar.less'

BigCalendar.momentLocalizer(moment) // or globalizeLocalizer

let allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k])

const events = [
  {
    id: 2165,
    teacher: '声乐鲍老师',
    title: '12:00 － 13:00\n声乐鲍老师\n教室: 交流课\n声乐精品第一阶段',
    classroom: '交流课',
    start: '2017-11-10T04:00:00.000Z',
    end: '2017-11-10T05:00:00.000Z',
    category: 'vocal-jp-cv',
    summary: '声乐精品第一阶段',
    students: 1,
    limit: 4,
    allDay: false,
    cancle_checked: false,
    index: 0,
    is_profession_vip: false,
  },
  {
    id: 2170,
    teacher: '声乐鲍老师',
    title: '12:00 － 13:00\n声乐鲍老师\n教室: 交流课\n声乐精品第一阶段',
    classroom: '交流课',
    start: '2017-12-15T04:00:00.000Z',
    end: '2017-12-15T05:00:00.000Z',
    category: 'vocal-jp-cv',
    summary: '声乐精品第一阶段',
    students: 0,
    limit: 4,
    allDay: false,
    cancle_checked: false,
    index: 1,
    is_profession_vip: false,
  },
  {
    id: 208,
    teacher: '声乐鲍老师',
    title: '12:00 － 12:30\n声乐鲍老师\n教室: 1号\n声乐精品第一阶段',
    classroom: '1号',
    start: '2018-01-02T04:00:00.000Z',
    end: '2018-01-02T04:30:00.000Z',
    category: 'vocal-jp-cv',
    summary: '声乐精品第一阶段',
    students: 0,
    limit: 4,
    allDay: false,
    cancle_checked: false,
    index: 2,
    is_profession_vip: false,
  },
  {
    id: 209,
    teacher: '声乐鲍老师',
    title: '13:30 － 14:00\n声乐鲍老师\n教室: 1号\n声乐精品第一阶段',
    classroom: '1号',
    start: '2018-01-02T05:30:00.000Z',
    end: '2018-01-02T06:00:00.000Z',
    category: 'vocal-jp-cv',
    summary: '声乐精品第一阶段',
    students: 0,
    limit: 4,
    allDay: false,
    cancle_checked: false,
    index: 3,
    is_profession_vip: false,
  },
  {
    id: 210,
    teacher: '声乐鲍老师',
    title: '16:00 － 16:30\n声乐鲍老师\n教室: 1号\n声乐精品第一阶段',
    classroom: '1号',
    start: '2018-01-02T08:00:00.000Z',
    end: '2018-01-02T08:30:00.000Z',
    category: 'vocal-jp-cv',
    summary: '声乐精品第一阶段',
    students: 0,
    limit: 4,
    allDay: false,
    cancle_checked: false,
    index: 4,
    is_profession_vip: false,
  },
  {
    id: 218,
    teacher: '声乐鲍老师',
    title: '16:30 － 17:30\n声乐鲍老师\n教室: 1号\n声乐精品第一阶段',
    classroom: '1号',
    start: '2018-01-15T08:30:00.000Z',
    end: '2018-01-15T09:30:00.000Z',
    category: 'vocal-jp-cv',
    summary: '声乐精品第一阶段',
    students: 0,
    limit: 4,
    allDay: false,
    cancle_checked: false,
    index: 5,
    is_profession_vip: false,
  },
]

const Calendar = ({ ...props }) => {
  return (
    <BigCalendar
      {...props}
      className={styles.calendar_box}
      events={events}
      views={allViews}
      step={60}
      defaultDate={new Date()}
    />
  )
}

export default Calendar
