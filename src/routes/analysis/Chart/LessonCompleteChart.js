import React from 'react'
import PropTypes from 'prop-types'
import { Spin } from 'antd'
import ReactEcharts from 'echarts-for-react'

const LessonCompleteChart = ({ loading, lessonComplete: { searchQuery: { idNumber }, data } }) => {
  const item = data[idNumber] || {
    pro_ontrack: 0,
    hd_ontrack: 0,
    jl_ontrack: 0,
  }
  const option = {
    title: {
      text: '学生合同On Track',
      subtext: `进行中的学生消课率统计 ${item.category_summary || ''}`,
      x: 'left',
    },
    tooltip: {
      formatter: '{b} : {c}',
    },
    series: [
      {
        name: '专业课',
        type: 'gauge',
        min: 0,
        max: 5,
        radius: '85%',
        axisLine: { // 坐标轴线
          lineStyle: { // 属性lineStyle控制线条样式
            width: 15,
          },
        },
        axisTick: { // 坐标轴小标记
          length: 20, // 属性length控制线长
          lineStyle: { // 属性lineStyle控制线条样式
            color: 'auto',
          },
        },
        splitLine: { // 分隔线
          length: 25, // 属性length控制线长
          lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
            color: 'auto',
          },
        },
        data: [{ value: item.pro_ontrack.toFixed(2), name: `专业课\n\n ${item.due_note ? `${item.due_note}` : ''}` }],
      },
      {
        name: '互动课onTrack',
        type: 'gauge',
        min: 0,
        max: 5,
        center: ['15%', '53%'], // 默认全局居中
        radius: '68%',
        axisLine: { // 坐标轴线
          lineStyle: { // 属性lineStyle控制线条样式
            width: 10,
          },
        },
        axisTick: { // 坐标轴小标记
          length: 20, // 属性length控制线长
          lineStyle: { // 属性lineStyle控制线条样式
            color: 'auto',
          },
        },
        splitLine: { // 分隔线
          length: 30, // 属性length控制线长
          lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
            color: 'auto',
          },
        },
        pointer: {
          width: 5,
        },
        data: [{ value: item.hd_ontrack.toFixed(2), name: '互动课' }],
      },
      {
        name: '交流课onTrack',
        type: 'gauge',
        min: 0,
        max: 5,
        center: ['85%', '53%'], // 默认全局居中
        radius: '68%',
        axisLine: { // 坐标轴线
          lineStyle: { // 属性lineStyle控制线条样式
            width: 10,
          },
        },
        axisTick: { // 坐标轴小标记
          length: 20, // 属性length控制线长
          lineStyle: { // 属性lineStyle控制线条样式
            color: 'auto',
          },
        },
        splitLine: { // 分隔线
          length: 30, // 属性length控制线长
          lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
            color: 'auto',
          },
        },
        pointer: {
          width: 5,
        },
        data: [{ value: item.jl_ontrack.toFixed(2), name: '交流课' }],
      },
    ],
  }

  return (
    <Spin spinning={loading}>
      <div style={{ height: 300 }}>
        {!loading && <ReactEcharts
          option={option}
          style={{ height: 300 }}
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
