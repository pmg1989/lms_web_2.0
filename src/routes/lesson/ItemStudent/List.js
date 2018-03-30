import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Modal, Radio, Row, Col, Table } from 'antd'
import { DropMenu } from 'components'
import moment from 'moment'
import AudioPlayer from 'components/MediaPlayer/AudioPlayer'
import { ADD, UPDATE, DETAIL, DELETE } from 'constants/options'
import styles from './List.less'

const confirm = Modal.confirm

function List ({
  user,
  lessonInfo: { available, deadline },
  lessonStudent: {
    list,
  },
  uploadRecordStatus,
  loading,
  addDeletePower,
  otherPower,
  onDeleteItem,
  onAttendance,
  onShowModal,
}) {
  const handleDeleteItem = (record) => {
    if (record.acronym) {
      Modal.warning({
        title: '警告',
        content: '已经考勤的学员，不能退课！',
      })
    } else {
      confirm({
        title: '您确定要退课吗?',
        onOk () {
          onDeleteItem({ userid: record.id, rolename: 'student' })
        },
      })
    }
  }

  const handleAttendance = (record, e) => {
    const startTime = moment.unix(available).subtract(0.5, 'hour').format('X')
    const endTime = moment.unix(deadline).add(0.5, 'hour').format('X')
    const now = moment().format('X')
    // 校长有权限补考勤
    if (user.rolename === 'coursecreator') {
      if (now > startTime) {
        onAttendance({ status: e.target.value, userid: record.id })
      } else {
        Modal.warning({
          title: '警告',
          content: '还未开课，不能考勤！',
        })
      }
      return
    }
    if (now > startTime && now < endTime) {
      onAttendance({ status: e.target.value, userid: record.id })
    } else {
      Modal.warning({
        title: '警告',
        content: '开课前半小时至课程结束后的半小时内才可以考勤，当前时间不在考勤时间范围内！',
      })
    }
  }

  const handleMenuClick = (key, record) => {
    return {
      [DELETE]: handleDeleteItem,
      [UPDATE]: () => onShowModal({ modalId: 1, userid: record.id, type: record.gradetime ? 'update' : 'create' }),
      [ADD]: () => onShowModal({ modalId: 2, userid: record.id, type: 'create', curItem: record }),
      [DETAIL]: () => onShowModal({ modalId: 3, userid: record.id, type: 'detail' }),
    }[key](record)
  }

  const checkComment = () => {
    const endTime = moment.unix(deadline).add(1, 'day').format('X')
    const now = moment().format('X')
    return now > endTime
  }

  const checkDelete = () => {
    const now = moment().format('X')
    return now > available
  }

  const columns = [
    {
      title: '姓名',
      dataIndex: 'firstname',
      key: 'firstname',
    }, {
      title: '考勤',
      dataIndex: 'acronym',
      key: 'acronym',
      render: (acronym, record) => (
        <Radio.Group size="small" disabled={!otherPower} value={acronym} onChange={e => handleAttendance(record, e)}>
          <Radio.Button value="P"><span className={styles.primary}>出席</span></Radio.Button>
          <Radio.Button value="L"><span className={styles.warning}>迟到</span></Radio.Button>
          <Radio.Button value="A"><span className={styles.danger}>缺席</span></Radio.Button>
        </Radio.Group>
      ),
    }, {
      title: '评价状态',
      dataIndex: 'gradetime',
      key: 'gradetime',
      render: gradetime => (<span>{gradetime ? '已' : '未'}评价</span>),
    }, {
      title: '操作',
      key: 'operation',
      render: (text, record) => (
        <DropMenu>
          <Menu onClick={({ key }) => handleMenuClick(key, record)}>
            {addDeletePower && <Menu.Item key={DELETE} disabled={checkDelete()}>退课</Menu.Item>}
            {otherPower && <Menu.Item key={UPDATE} disabled={checkComment()}>评价</Menu.Item>}
            {otherPower && uploadRecordStatus && <Menu.Item key={ADD}>上传录音</Menu.Item>}
            {otherPower && user.rolename !== 'teacher' && <Menu.Item key={DETAIL}>查看反馈</Menu.Item>}
          </Menu>
        </DropMenu>
      ),
      // fixed: 'right'
    },
  ]

  const tableProps = {
    className: styles.table_list,
    loading,
    columns,
    scroll: { x: 500 },
    dataSource: list,
    pagination: false,
    animate: false,
    size: 'small',
    defaultExpandAllRows: true,
    rowKey: record => record.id,
  }

  tableProps.expandedRowRender = (record) => {
    const { jl_song: { song, original_singer: originalSinger, back_source: backSource } } = record
    if (song && originalSinger) {
      return (
        <div className={styles.text_left}>
          <Row>
            <Col>教室笔记：{record.teacher_grade.suggestion.lesson}</Col>
          </Row>
          <Row>
            <Col>课后评价：{record.teacher_grade.suggestion.student}</Col>
          </Row>
          <Row>
            <Col span={8}>歌曲名：{song}</Col>
            <Col span={8}>原唱：{originalSinger}</Col>
            <Col span={8}>{backSource === 2 && '不'}自带伴奏</Col>
          </Row>
          <Row>
            <Col>文件名：{record.jl_recording.name || '未上传'}</Col>
          </Row>
          {record.jl_recording.url &&
            <Row>
              <Col>
                <AudioPlayer src={record.jl_recording.url} autoPlay={false} />
              </Col>
            </Row>
          }
        </div>
      )
    }
    return (
      <div className={styles.text_left}>
        <Row>
          <Col>教室笔记：{record.teacher_grade.suggestion.lesson}</Col>
        </Row>
        <Row>
          <Col>课后评价：{record.teacher_grade.suggestion.student}</Col>
        </Row>
      </div>
    )
  }

  return (
    <Table {...tableProps} />
  )
}

List.propTypes = {
  user: PropTypes.object.isRequired,
  uploadRecordStatus: PropTypes.bool.isRequired,
  lessonInfo: PropTypes.object.isRequired,
  lessonStudent: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  addDeletePower: PropTypes.bool.isRequired,
  otherPower: PropTypes.bool.isRequired,
  onDeleteItem: PropTypes.func.isRequired,
  onAttendance: PropTypes.func.isRequired,
  onShowModal: PropTypes.func.isRequired,
}

export default List
