import React from 'react'
import PropTypes from 'prop-types'
import { Spin, Row, Col } from 'antd'
import ReactEcharts from 'echarts-for-react'

const LessonChart = ({ loading, teacher: { data } }) => {
  const leftCal = data && (data.teacher_lessonsum_monthly - data.monthlycnt_ok)
  const left = leftCal > 0 ? leftCal : 0
  const values = {
    pro_vip: data.monthlycnt_ok_vip || 0,
    pro_jp: data.monthlycnt_ok_jp || 0,
    left,
    substitutee: data.monthlycnt_substitutee || 0,
    substituter: data.monthlycnt_substituter || 0,
  }

  const legendData = [
    `专业VIP课时 | ${values.pro_vip}`,
    `专业精品课时 | ${values.pro_jp}`,
    `未完成课时 | ${values.left}`,
    `被代课时 | ${values.substitutee}`,
    `已代课时 | ${values.substituter}`,
  ]

  const seriesData = [
    { value: values.pro_vip, name: legendData[0] },
    { value: values.pro_jp, name: legendData[1] },
    { value: values.left, name: legendData[2] },
    { value: values.substitutee, name: legendData[3] },
    { value: values.substituter, name: legendData[4] },
  ]

  const option = {
    title: {
      text: '本月课时统计',
      subtext: '老师本月课时统计报表',
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
        [legendData[3]]: false,
        [legendData[4]]: false,
      },
    },
    series: [
      {
        name: '课时统计',
        type: 'pie',
        center: ['70%', '50%'], // 默认全局居中
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
      text: '本月课时统计',
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
            <Col span={14}>
              <ReactEcharts
                option={option}
                style={{ height: 300 }}
              />
            </Col>
            <Col span={10}>
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
