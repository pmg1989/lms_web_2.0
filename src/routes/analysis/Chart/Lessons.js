import React from 'react'
import PropTypes from 'prop-types'
import { Card, Spin } from 'antd'
import ReactEcharts from 'echarts-for-react'

const Lessons = ({ loading, lessons: { legendData, seriesData } }) => {
  const option = {
    title: {
      text: '课时统计',
      subtext: '可根据月份/老师筛选统计',
      x: 'left',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      x: 'right',
      data: legendData,
    },
    series: [
      {
        name: '课时统计',
        type: 'pie',
        radius: ['60%', '80%'],
        // roseType: 'radius',
        // avoidLabelOverlap: false,
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
        data: seriesData,
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay () {
          return Math.random() * 300
        },
      },
    ],
  }

  return (
    <Spin spinning={loading}>
      <Card style={{ height: 350 }}>
        {!loading && <ReactEcharts
          option={option}
          style={{ height: 300 }}
        />}
      </Card>
    </Spin>
  )
}

Lessons.propTypes = {
  loading: PropTypes.bool,
  lessons: PropTypes.object.isRequired,
}

export default Lessons
