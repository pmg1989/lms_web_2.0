import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Badge, Popover } from 'antd'
import { Link } from 'dva/router'
import classnames from 'classnames'
import styles from './BadgeBox.less'

function BadgeBox ({ list, readMessage }) {
  const content = (
    <div className={styles.body}>
      {list.map((item, key) => (
        <p key={key} className={styles.row}>
          <Link onClick={() => readMessage(item.id)} to={item.linkTo}>{item.message}</Link>
        </p>
      ))}
      {list.length === 0 && <p className={classnames(styles.row, styles.text_center)}>~~暂无消息通知~~</p>}
    </div>
  )

  return (
    <div className={styles.badgeBox}>
      <div className={styles.badge}>
        <Popover content={content} title="待处理消息列表" trigger="click">
          <Badge count={list.length} overflowCount={99}>
            <Icon type="message" className={styles.size} />
          </Badge>
        </Popover>
      </div>
    </div>
  )
}

BadgeBox.propTypes = {
  list: PropTypes.array.isRequired,
  readMessage: PropTypes.func.isRequired,
}

export default BadgeBox
