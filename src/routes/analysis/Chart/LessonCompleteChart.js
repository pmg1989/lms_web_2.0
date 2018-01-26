import React from 'react'
import PropTypes from 'prop-types'
import { Spin } from 'antd'
import moment from 'moment'
import ReactEcharts from 'echarts-for-react'

const renderXAxisData = (data, type, year, month) => {
  if (type === 'month') {
    return Object.values(data).sort().reduce((arr, yearMonths) => {
      return arr.concat(Object.keys(yearMonths).filter(yearMonth => yearMonth !== 'all').sort())
    }, [])
  } else if (type === 'day') {
    const monthDays = (data[year] || {})[`${year}/${month}`] || {}
    return Object.keys(monthDays).filter(monthDay => monthDay !== 'all').sort()
  }
  return []
}

const renderSeriesData = (data, type, subject, year, month) => {
  if (type === 'month') {
    const years = Object.values(data).sort()
    const yearsMonths = years.reduce((arr, yearMonths) => {
      return arr.concat(Object.keys(yearMonths).filter(yearMonth => yearMonth !== 'all').sort())
    }, [])
    return yearsMonths.map((yearMonth) => {
      const _year = yearMonth.split('/')[0]
      return (data[_year][yearMonth].all[subject] / data[_year][yearMonth].all.count).toFixed(2)
    })
  } else if (type === 'day') {
    const monthDays = (data[year] || {})[`${year}/${month}`] || {}
    return Object.keys(monthDays).filter(monthDay => monthDay !== 'all').sort()
      .map((monthDay) => {
        const item = data[year][`${year}/${month}`][monthDay]
        return (item[subject] / item.count).toFixed(2)
      })
  }
  return []
}

const LessonCompleteChart = ({ loading, lessonComplete: { searchQuery: { type, deadline }, data } }) => {
  const curYear = moment.unix(deadline).format('YYYY')
  const curMonth = moment.unix(deadline).format('MM')
  // console.log(renderXAxisData(data, type, curYear, curMonth))
  // console.log(renderSeriesData(data, type, 'profession', curYear, curMonth))
  const option = {
    title: {
      text: '学生合同 On Track',
      subtext: '进行中的学生消课率统计',
      x: 'left',
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['专业课', '互动课', '交流课'],
    },
    grid: {
      left: '2%',
      right: '2%',
      bottom: '2%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: renderXAxisData(data, type, curYear, curMonth),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '专业课',
        type: 'line',
        data: renderSeriesData(data, type, 'profession', curYear, curMonth),
      },
      {
        name: '互动课',
        type: 'line',
        data: renderSeriesData(data, type, 'hd', curYear, curMonth),
      },
      {
        name: '交流课',
        type: 'line',
        data: renderSeriesData(data, type, 'jl', curYear, curMonth),
      },
    ],
  }

  return (
    <Spin spinning={loading}>
      <div style={{ height: 400 }}>
        {!loading && <ReactEcharts
          option={option}
          style={{ height: 400 }}
        />}
      </div>
    </Spin>
  )
}

LessonCompleteChart.propTypes = {
  loading: PropTypes.bool,
  lessonComplete: PropTypes.object.isRequired,
}

export default LessonCompleteChart
