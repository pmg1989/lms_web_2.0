import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Card, Col, Row } from 'antd'
import styles from './ComingLessons.less'

function ComingLessons ({ list, loading }) {
  return (
    <Card title={<h3>即将到来的课程</h3>} loading={loading}>
      <div className={styles.box}>
        {list.map((item, key) => (
          <Row className={styles.row} gutter={16} key={key}>
            <Col span={12}>
              {moment.unix(item.available).format('YYYY-MM-DD')} {moment.unix(item.available).format('HH:mm')} - {moment.unix(item.deadline).format('HH:mm')}
            </Col>
            <Col span={12}>
              <strong>{item.category_summary}</strong> {item.teacher_alternatename} {item.classroom}教室
            </Col>
          </Row>
        ))}
      </div>
    </Card>
  )
}

ComingLessons.propTypes = {
  loading: PropTypes.bool,
  list: PropTypes.array.isRequired,
}

export default ComingLessons
