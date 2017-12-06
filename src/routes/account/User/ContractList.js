import React from 'react'
import PropTypes from 'prop-types'
import { Tag, Button } from 'antd'
import moment from 'moment'
import classnames from 'classnames'
import { getCategory } from 'utils/dictionary'
import styles from './ContractList.less'

const now = new Date().getTime()

const Empty = ({ children }) => (
  <div className={styles.empty_box}>{children}</div>
)

Empty.propTypes = {
  children: PropTypes.element.isRequired,
}

const Contract = ({ type, status, item, onShowTeacherModal, onShowHistoryListModal, setTeacherPower, getHistoryPower }) => {
  const isProfession = type === 'profession'
  const currentAvailable = item.current_lesson_available
  const hasNext = !!currentAvailable
  const isBeginning = hasNext && (currentAvailable - (now / 1000) < 60 * 60 * 24)

  return (
    <div className={classnames(styles.item, !isProfession && styles.flex_item)}>
      <div className={styles.left}>
        <span className={styles.title}>{getCategory(type)} - {isProfession && <Tag color="orange">{item.category_summary}</Tag>}</span>
        <span className={styles.content}>
          {status === 0 && '待开课'}
          {status === 1 && !hasNext && '下节课 未预约'}
          {status === 1 && hasNext &&
            <span>
              下节课 {moment.unix(currentAvailable).format('YYYY-MM-DD HH:mm')}{isBeginning && '（即将开课）'}
            </span>
          }
          {status === 2 && '已结课'}
          {isProfession && <span>&nbsp;&nbsp;{!!item.modifylog.teacher_name.length && item.modifylog.teacher_name.reverse().map((cur, index) => (index === 0 ? cur.teacher_name : `<--${cur.teacher_name}`))}</span>}
        </span>
      </div>
      <div className={styles.right}>
        <span>已完成 · {item.attended_lesson_cnt} / {item.constract_lesson_cnt}</span>
        {isProfession && status === 1 &&
        <span>
          {setTeacherPower && <Button type="primary" size="small" onClick={() => onShowTeacherModal(item)}>设置老师</Button>}
          {getHistoryPower && <Button className={styles.margin_left} type="primary" size="small" onClick={() => onShowHistoryListModal(item)}>查看历史</Button>}
        </span>}
      </div>
    </div>
  )
}

Contract.propTypes = {
  type: PropTypes.string.isRequired,
  status: PropTypes.number.isRequired,
  item: PropTypes.object.isRequired,
  onShowTeacherModal: PropTypes.func.isRequired,
  onShowHistoryListModal: PropTypes.func.isRequired,
  setTeacherPower: PropTypes.bool.isRequired,
  getHistoryPower: PropTypes.bool.isRequired,
}

const ContractList = ({ list, status, ...contractProps }) => {
  return (
    <div className={styles.list_box}>
      {list.map((item, key) => {
        return (
          <div key={key} className={styles.list}>
            <Contract type="profession" status={status} item={item.profession} {...contractProps} />
            <div className={styles.flex_box}>
              {item.hd.hdid && <Contract type="hd" title="互动课" status={status} item={item.hd} {...contractProps} />}
              {item.jl.jlid && <Contract type="jl" title="交流课" status={status} item={item.jl} {...contractProps} />}
            </div>
          </div>
        )
      })}
      {list.length === 0 &&
        <div className={styles.list}>
          <Empty>
            <span>暂无课程</span>
          </Empty>
        </div>
      }
    </div>
  )
}

ContractList.propTypes = {
  list: PropTypes.array.isRequired,
  status: PropTypes.number.isRequired,
  onShowTeacherModal: PropTypes.func.isRequired,
}

export default ContractList