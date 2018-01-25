import React from 'react'
import PropTypes from 'prop-types'
import { Spin } from 'antd'
import moment from 'moment'
import ReactEcharts from 'echarts-for-react'

const renderXAxisData = (data, type, curMonth) => {
  if (type === 'month') {
    return Object.keys(data).sort().map(item => item)
  } else if (type === 'day') {
    return Object.keys((data[curMonth] || {})).sort().filter(item => item !== 'all')
  }
  return []
}

const renderSeriesData = (data, type, subject, curMonth) => {
  if (type === 'month') {
    return Object.keys(data).sort().map(item => (data[item].all[subject] / data[item].all.count).toFixed(2))
  } else if (type === 'day') {
    return Object.keys((data[curMonth] || {})).sort().filter(item => item !== 'all')
      .map(item => (data[curMonth][item][subject] / data[curMonth][item].count).toFixed(2))
  }
  return []
}

const LessonCompleteChart = ({ loading, lessonComplete: { searchQuery: { type, deadline }, data } }) => {
  const curMonth = moment.unix(deadline).format('YYYY/MM')

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
      data: renderXAxisData(data, type, curMonth),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '专业课',
        type: 'line',
        data: renderSeriesData(data, type, 'profession', curMonth),
      },
      {
        name: '互动课',
        type: 'line',
        data: renderSeriesData(data, type, 'hd', curMonth),
      },
      {
        name: '交流课',
        type: 'line',
        data: renderSeriesData(data, type, 'jl', curMonth),
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
