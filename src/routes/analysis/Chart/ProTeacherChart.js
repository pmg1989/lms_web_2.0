import React from 'react'
import PropTypes from 'prop-types'
import { Spin } from 'antd'
import ReactEcharts from 'echarts-for-react'

const ProTeacherChart = ({ loading, proTeacher: { data } }) => {
  const option = {
    title: {
      text: '老师合同进展统计',
      subtext: '专业课老师开课中的合同报表',
      x: 'left',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
      },
    },
    legend: {
      data: ['第一阶段合同', '第二阶段合同', '第三阶段合同', '第一阶段精品', '第二阶段精品', '第三阶段精品', '第一阶段VIP', '第二阶段VIP', '第三阶段VIP'],
    },
    grid: {
      left: '0%',
      right: '0%',
      bottom: '0%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        data: data.name,
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
    series: [
      {
        name: '第一阶段合同',
        type: 'bar',
        stack: '合同',
        data: data.stage1Contract,
      },
      {
        name: '第二阶段合同',
        type: 'bar',
        stack: '合同',
        data: data.stage2Contract,
      },
      {
        name: '第三阶段合同',
        type: 'bar',
        stack: '合同',
        data: data.stage3Contract,
      },
      {
        name: '第一阶段精品',
        type: 'bar',
        stack: '精品',
        data: data.stage1Jp,
      },
      {
        name: '第二阶段精品',
        type: 'bar',
        stack: '精品',
        data: data.stage2Jp,
      },
      {
        name: '第三阶段精品',
        type: 'bar',
        stack: '精品',
        data: data.stage3Jp,
      },
      {
        name: '第一阶段VIP',
        type: 'bar',
        stack: 'VIP',
        data: data.stage1Vip,
      },
      {
        name: '第二阶段VIP',
        type: 'bar',
        stack: 'VIP',
        data: data.stage2Vip,
      },
      {
        name: '第三阶段VIP',
        type: 'bar',
        stack: 'VIP',
        data: data.stage3Vip,
      },
    ],
  }

  return (
    <Spin spinning={loading}>
      <div style={{ height: 500 }}>
        {!loading &&
          <ReactEcharts
            option={option}
            style={{ height: 500 }}
          />}
      </div>
    </Spin>
  )
}

ProTeacherChart.propTypes = {
  loading: PropTypes.bool,
  proTeacher: PropTypes.object.isRequired,
}

export default ProTeacherChart
