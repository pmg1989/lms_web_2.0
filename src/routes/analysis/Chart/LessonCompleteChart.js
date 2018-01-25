import React from 'react'
import PropTypes from 'prop-types'
import { Spin } from 'antd'
import moment from 'moment'
import ReactEcharts from 'echarts-for-react'

// const emptyData = {
//   count: 1,
//   profession: 0,
//   hd: 0,
//   jl: 0,
// }

const renderXAxisData = (data, type, year, month) => {
  if (type === 'month') {
    const months = data[year] || {}
    return Object.keys(months).sort().filter(curMonth => curMonth !== 'all')
  } else if (type === 'day') {
    return Object.keys((data[month] || {})).sort().filter(item => item !== 'all')
  }
  return []
}

const renderSeriesData = (data, type, subject, year, month) => {
  if (type === 'month') {
    const months = data[year] || {}
    const monthArr = Object.keys(months).sort().filter(curMonth => curMonth !== 'all')
    return monthArr.map(curMonth => (months[curMonth].all[subject] / months[curMonth].all.count).toFixed(2))
  } else if (type === 'day') {
    return Object.keys((data[month] || {})).sort().filter(item => item !== 'all')
      .map(item => (data[month][item][subject] / data[month][item].count).toFixed(2))
  }
  return []
}

const LessonCompleteChart = ({ loading, lessonComplete: { searchQuery: { type, deadline }, data } }) => {
  const curYear = moment.unix(deadline).format('YYYY')
  const curMonth = moment.unix(deadline).format('MM')
  // console.log(renderXAxisData(data, type, curYear, curMonth))
  console.log(renderSeriesData(data, type, 'profession', curYear, curMonth))
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
