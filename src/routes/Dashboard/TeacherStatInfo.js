import React from 'react'
import PropTypes from 'prop-types'
import { Card, Col, Row } from 'antd'
import styles from './TeacherStatInfo.less'

function TeacherStatInfo ({ item, loading }) {
  return (
    <Card title={<h3>课时统计</h3>} loading={loading}>
      <div className={styles.box}>
        <Row className={styles.row}>
          <Col>本月已上课时：{item.monthlycnt_ok} / {item.teacher_lessonsum_monthly}</Col>
        </Row>
        <Row className={styles.row}>
          <Col>本月精品课时：{item.monthlycnt_ok_jp}</Col>
        </Row>
        <Row className={styles.row}>
          <Col>本月vip课时：{item.monthlycnt_ok_vip}</Col>
        </Row>
        <Row className={styles.row}>
          <Col>本月被代课时：{item.monthlycnt_substitutee}</Col>
        </Row>
        <Row className={styles.row}>
          <Col>本月已代课时：{item.monthlycnt_substituter}</Col>
        </Row>
      </div>
    </Card>
  )
}

TeacherStatInfo.propTypes = {
  loading: PropTypes.bool,
  item: PropTypes.object.isRequired,
}

export default TeacherStatInfo
