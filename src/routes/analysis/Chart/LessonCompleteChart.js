import React from 'react'
import PropTypes from 'prop-types'
import { Spin } from 'antd'
import ReactEcharts from 'echarts-for-react'

const LessonCompleteChart = ({ loading }) => {
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
      data: ['一月', '二月', '三月', '四月', '五月', '六月'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '专业课',
        type: 'line',
        data: [120, 132, 101, 134, 90, 230],
      },
      {
        name: '互动课',
        type: 'line',
        data: [220, 182, 191, 234, 290, 330],
      },
      {
        name: '交流课',
        type: 'line',
        data: [150, 232, 201, 154, 190, 330],
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
//   teacher: PropTypes.object.isRequired,
}

export default LessonCompleteChart
