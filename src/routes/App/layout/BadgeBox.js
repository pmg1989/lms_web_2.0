import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Icon, Badge, Popover } from 'antd'
import { Link } from 'dva/router'
import classnames from 'classnames'
import styles from './BadgeBox.less'

function BadgeBox ({ dispatch, messageList }) {
  const handleReadMessage = (id) => {
    dispatch({ type: 'app/readMessage', payload: { id } })
  }

  const content = (
    <div className={styles.body}>
      {messageList.map((item, key) => (
        <p key={key} className={styles.row}>
          <Link onClick={() => handleReadMessage(item.id)} to={item.linkTo}>{item.message}</Link>
        </p>
      ))}
      {messageList.length === 0 && <p className={classnames(styles.row, styles.text_center)}>~~暂无消息通知~~</p>}
    </div>
  )

  return (
    <div className={styles.badgeBox}>
      <div className={styles.badge}>
        <Popover content={content} title="待处理消息列表" trigger="click">
          <Badge count={messageList.length} overflowCount={99}>
            <Icon type="message" className={styles.size} />
          </Badge>
        </Popover>
      </div>
    </div>
  )
}

BadgeBox.propTypes = {
  dispatch: PropTypes.func.isRequired,
  messageList: PropTypes.array.isRequired,
}

function mapStateToProps ({ app: { messageList } }) {
  return { messageList }
}

export default connect(mapStateToProps)(BadgeBox)
