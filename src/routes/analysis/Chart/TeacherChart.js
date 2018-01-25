import React from 'react'
import PropTypes from 'prop-types'
import { Spin } from 'antd'
import ReactEcharts from 'echarts-for-react'

const LessonChart = ({ loading, teacher: { searchQuery: { name }, data } }) => {
  const values = {
    pro_vip: (data[name] && data[name].pro_vip) || 0,
    pro_jp: (data[name] && data[name].pro_jp) || 0,
    pro_other: (data[name] && data[name].pro_other) || 0,
    hd: (data[name] && data[name].hd) || 0,
    jl: (data[name] && data[name].jl) || 0,
    substitutee: (data[name] && data[name].substitutee) || 0,
    substituter: (data[name] && data[name].substituter) || 0,
  }

  const legendData = [
    `专业VIP课时 | ${values.pro_vip}`,
    `专业精品课时 | ${values.pro_jp}`,
    `专业其他课时 | ${values.pro_other}`,
    `互动课时 | ${values.hd}`,
    `交流课时 | ${values.jl}`,
    `被代课时 | ${values.substitutee}`,
    `已代课时 | ${values.substituter}`,
  ]

  const seriesData = [
    { value: values.pro_vip, name: legendData[0] },
    { value: values.pro_jp, name: legendData[1] },
    { value: values.pro_other, name: legendData[2] },
    { value: values.hd, name: legendData[3] },
    { value: values.jl, name: legendData[4] },
    { value: values.substitutee, name: legendData[5] },
    { value: values.substituter, name: legendData[6] },
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
      selected: { [legendData[5]]: false, [legendData[6]]: false },
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
