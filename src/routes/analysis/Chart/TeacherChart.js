import React from 'react'
import PropTypes from 'prop-types'
import { Spin } from 'antd'
import ReactEcharts from 'echarts-for-react'

const LessonChart = ({ loading, teacher: { searchQuery: { name }, data } }) => {
  const legendData = [
    `专业VIP课时 | ${(data[name] && data[name].pro_vip) || 0}`,
    `专业精品课时 | ${(data[name] && data[name].pro_jp) || 0}`,
    `专业其他课时 | ${(data[name] && data[name].pro_other) || 0}`,
    `互动课时 | ${(data[name] && data[name].hd) || 0}`,
    `交流课时 | ${(data[name] && data[name].jl) || 0}`,
    `被代课时 | ${(data[name] && data[name].substitutee) || 0}`,
    `已代课时 | ${(data[name] && data[name].substituter) || 0}`,
  ]

  const seriesData = [
    { value: (data[name] && data[name].pro_vip) || 0, name: legendData[0] },
    { value: (data[name] && data[name].pro_jp) || 0, name: legendData[1] },
    { value: (data[name] && data[name].pro_other) || 0, name: legendData[2] },
    { value: (data[name] && data[name].hd) || 0, name: legendData[3] },
    { value: (data[name] && data[name].jl) || 0, name: legendData[4] },
    { value: (data[name] && data[name].substitutee) || 0, name: legendData[5] },
    { value: (data[name] && data[name].substituter) || 0, name: legendData[6] },
  ]

  const option = {
    title: {
      text: '课时统计',
      subtext: '老师课时统计月报表',
      x: 'left',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      x: 'right',
      data: legendData || [],
    },
    series: [
      {
        name: '课时统计',
        type: 'pie',
        radius: ['60%', '75%'],
        label: {
          emphasis: {
            show: true,
            textStyle: {
              fontSize: '16',
              fontWeight: 'bold',
            },
          },
        },
        labelLine: {
          normal: {
            show: true,
          },
        },
        data: seriesData || [],
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

LessonChart.propTypes = {
  loading: PropTypes.bool,
  teacher: PropTypes.object.isRequired,
}

export default LessonChart
