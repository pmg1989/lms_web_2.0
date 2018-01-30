import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Badge, Menu, Dropdown } from 'antd'
import { Link } from 'dva/router'
import styles from './BadgeBox.less'

function BadgeBox ({ list, readMessage }) {
  const menu = (
    <Menu>
      {list.map((item, key) => (
        <Menu.Item key={key}>
          <Link onClick={() => readMessage(item.id)} to={item.linkTo}>{item.message}</Link>
        </Menu.Item>
      ))}
    </Menu>
  )

  return (
    <div className={styles.badgeBox}>
      <div className={styles.badge}>
        <Dropdown overlay={menu} placement="bottomCenter">
          <Badge count={list.length} overflowCount={99}>
            <Icon type="message" className={styles.size} />
          </Badge>
        </Dropdown>
      </div>
    </div>
  )
}

BadgeBox.propTypes = {
  list: PropTypes.array.isRequired,
  readMessage: PropTypes.func.isRequired,
}

export default BadgeBox
