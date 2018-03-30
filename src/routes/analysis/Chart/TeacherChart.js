import React from 'react'
import PropTypes from 'prop-types'
import { Spin, Row, Col } from 'antd'
import ReactEcharts from 'echarts-for-react'

const LessonChart = ({ loading, teacher: { searchQuery: { name }, data } }) => {
  const item = data[name]
  const leftCal = item && (item.monthly - item.all)
  const left = leftCal > 0 ? leftCal : 0
  const values = {
    pro_vip: (item && item.pro_vip) || 0,
    pro_jp: (item && item.pro_jp) || 0,
    pro_other: (item && item.pro_other) || 0,
    hd: (item && item.hd) || 0,
    jl: (item && item.jl) || 0,
    left,
    substitutee: (item && item.substitutee) || 0,
    substituter: (item && item.substituter) || 0,
  }

  const legendData = [
    `专业VIP课时 : ${values.pro_vip}`,
    `专业精品课时 : ${values.pro_jp}`,
    `专业编曲课时 : ${values.pro_other}`,
    `互动课时 : ${values.hd}`,
    `交流课时 : ${values.jl}`,
    `待完成课时 : ${values.left}`,
    `被代课时 : ${values.substitutee}`,
    `已代课时 : ${values.substituter}`,
  ]

  const seriesData = [
    { value: values.pro_vip, name: legendData[0] },
    { value: values.pro_jp, name: legendData[1] },
    { value: values.pro_other, name: legendData[2] },
    { value: values.hd, name: legendData[3] },
    { value: values.jl, name: legendData[4] },
    { value: values.left, name: legendData[5] },
    { value: values.substitutee, name: legendData[6] },
    { value: values.substituter, name: legendData[7] },
  ]

  const option = {
    title: {
      text: '课时统计',
      subtext: `老师课时统计月报表(保底课时：${(item && item.monthly) || 0})`,
      x: 'left',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      x: 'left',
      top: '25%',
      data: legendData || [],
      selected: {
        [legendData[0]]: values.pro_vip > 0,
        [legendData[1]]: values.pro_jp > 0,
        [legendData[2]]: values.pro_other > 0,
        [legendData[3]]: values.hd > 0,
        [legendData[4]]: values.jl > 0,
        [legendData[5]]: values.left > 0,
        [legendData[6]]: false,
        [legendData[7]]: false },
    },
    series: [
      {
        name: '课时统计',
        type: 'pie',
        center: ['60%', '50%'], // 默认全局居中
        // radius: ['60%', '75%'],
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

  const option2 = {
    title: {
      text: '课时统计',
      subtext: '已代课时/被代课时统计',
      x: 'center',
    },
    xAxis: {
      type: 'category',
      data: ['已代课时', '被代课时'],
    },
    yAxis: {
      type: 'value',
    },
    series: [{
      data: [values.substitutee, values.substituter],
      type: 'bar',
      barWidth: '35%',
    }],
  }

  return (
    <Spin spinning={loading}>
      <div style={{ height: 300 }}>
        {!loading &&
        <Row>
          <Col md={{ span: 14 }} xs={{ span: 24 }}>
            <ReactEcharts
              option={option}
              style={{ height: 300 }}
            />
          </Col>
          <Col md={{ span: 10 }} xs={{ span: 24 }}>
            <ReactEcharts
              option={option2}
              style={{ height: 300 }}
            />
          </Col>
        </Row>}
      </div>
    </Spin>
  )
}

LessonChart.propTypes = {
  loading: PropTypes.bool,
  teacher: PropTypes.object.isRequired,
}

export default LessonChart
