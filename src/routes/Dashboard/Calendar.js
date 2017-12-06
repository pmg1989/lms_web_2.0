import React from 'react'
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/less/styles.less'

BigCalendar.momentLocalizer(moment) // or globalizeLocalizer

let allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k])

const events = [
  {
    title: 'All Day Event very long title',
    allDay: true,
    start: new Date(2017, 12, 6),
    end: new Date(2017, 12, 6),
  },
  {
    title: 'Long Event',
    start: new Date(2017, 12, 6),
    end: new Date(2017, 12, 7),
  },

  {
    title: 'DTS STARTS',
    start: new Date(2017, 12, 13, 0, 0, 0),
    end: new Date(2017, 12, 20, 0, 0, 0),
  },
]

const Calendar = ({ ...props }) => {
  return (
    <BigCalendar
      {...props}
      events={events}
      views={allViews}
      step={60}
      // defaultDate={new Date()}
    />
  )
}

export default Calendar
