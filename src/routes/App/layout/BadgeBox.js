import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Icon, Badge, Popover, Row, Col, Tooltip } from 'antd'
import moment from 'moment'
import { Link } from 'dva/router'
import classnames from 'classnames'
import styles from './BadgeBox.less'

const ScheduleBox = ({ list }) => {
  const contentSchedule = (
    <div className={classnames(styles.body, styles.schedule_body)}>
      {list.map((item, key) => (
        <Row className={styles.row} key={key}>
          <Col span={10}>
            {moment.unix(item.available).format('MM-DD')} {moment.unix(item.available).format('HH:mm')} - {moment.unix(item.deadline).format('HH:mm')}
          </Col>
          <Col span={14}>
            <strong>{item.category_summary}</strong> {item.teacher_alternatename} {item.classroom}教室
          </Col>
        </Row>
      ))}
      {!list.length && <p className={classnames(styles.row, styles.text_center)}>~~暂无即将到来的课程~~</p>}
    </div>
  )

  return (
    <div className={styles.badge}>
      <Popover content={contentSchedule} title="即将到来的课程" trigger="click">
        <Tooltip title="即将到来的课程">
          <Icon type="schedule" className={styles.size} />
        </Tooltip>
      </Popover>
    </div>
  )
}
ScheduleBox.propTypes = {
  list: PropTypes.array.isRequired,
}

const MessageBox = ({ list, onReadMessage }) => {
  const contentMessage = (
    <div className={styles.body}>
      {list.map((item, key) => (
        <p key={key} className={styles.row}>
          <Link onClick={() => onReadMessage(item.id)} to={item.linkTo}>{item.message}</Link>
        </p>
      ))}
      {list.length === 0 && <p className={classnames(styles.row, styles.text_center)}>~~暂无消息通知~~</p>}
    </div>
  )

  return (
    <div className={styles.badge}>
      <Popover content={contentMessage} title="待处理消息列表" trigger="click">
        <Badge count={list.length} overflowCount={99}>
          <Icon type="message" className={styles.size} />
        </Badge>
      </Popover>
    </div>
  )
}
MessageBox.propTypes = {
  list: PropTypes.array.isRequired,
  onReadMessage: PropTypes.func.isRequired,
}

const namespace = 'app'
const roles = ['admin', 'coursecreator', 'teacher']

class BadgeBox extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    messageList: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    comingLessons: PropTypes.array.isRequired,
  }

  componentWillMount () {
    const { dispatch, user } = this.props
    if (roles.includes(user.rolename)) {
      dispatch({ type: `${namespace}/queryComingLessons` })
    }
  }

  render () {
    const { dispatch, messageList, user, comingLessons } = this.props

    const scheduleBoxProps = {
      list: comingLessons,
    }

    const messageBoxProps = {
      list: messageList,
      onReadMessage (id) {
        dispatch({ type: `${namespace}/readMessage`, payload: { id } })
      },
    }

    return (
      <div className={styles.badgeBox}>
        {roles.includes(user.rolename) && <ScheduleBox {...scheduleBoxProps} />}
        <MessageBox {...messageBoxProps} />
      </div>
    )
  }
}

function mapStateToProps ({ app: { messageList, user, comingLessons } }) {
  return { messageList, user, comingLessons }
}

export default connect(mapStateToProps)(BadgeBox)
