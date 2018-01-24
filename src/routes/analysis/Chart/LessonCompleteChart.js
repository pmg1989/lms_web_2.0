import React from 'react'
import PropTypes from 'prop-types'
import { Spin } from 'antd'
import ReactEcharts from 'echarts-for-react'

const LessonCompleteChart = ({ loading, lessonComplete: { data } }) => {
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
      data: Object.keys(data).map(item => item),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '专业课',
        type: 'line',
        data: Object.keys(data).map(item => (data[item].profession / data[item].count).toFixed(2)),
      },
      {
        name: '互动课',
        type: 'line',
        data: Object.keys(data).map(item => (data[item].hd / data[item].count).toFixed(2)),
      },
      {
        name: '交流课',
        type: 'line',
        data: Object.keys(data).map(item => (data[item].jl / data[item].count).toFixed(2)),
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
