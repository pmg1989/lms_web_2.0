import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Modal, Radio, Row, Col, Tag, Table } from 'antd'
import { DropMenu } from 'components'
import AudioPlayer from 'components/MediaPlayer/AudioPlayer'
import { ADD, UPDATE, DETAIL, DELETE } from 'constants/options'
import styles from './List.less'

const confirm = Modal.confirm

function List ({
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

  const handleMenuClick = (key, record) => {
    return {
      [DELETE]: handleDeleteItem,
      [UPDATE]: () => onShowModal({ modalId: 1, userid: record.id, type: record.gradetime ? 'update' : 'create' }),
      [ADD]: () => onShowModal({ modalId: 2, userid: record.id, type: 'create', curItem: record }),
      [DETAIL]: () => onShowModal({ modalId: 3, userid: record.id, type: 'detail' }),
    }[key](record)
  }

  const columns = [
    {
      title: '姓名',
      dataIndex: 'firstname',
      key: 'firstname',
      width: 250,
    }, {
      title: '考勤',
      dataIndex: 'acronym',
      key: 'acronym',
      width: 240,
      render: (acronym, record) => (
        <Radio.Group defaultValue={acronym} onChange={e => onAttendance({ status: e.target.value, userid: record.id })}>
          <Radio.Button value="P"><span className={styles.primary}>出席</span></Radio.Button>
          <Radio.Button value="L"><span className={styles.warning}>迟到</span></Radio.Button>
          <Radio.Button value="A"><span className={styles.danger}>缺席</span></Radio.Button>
        </Radio.Group>
      ),
    }, {
      title: '评价状态',
      dataIndex: 'gradetime',
      key: 'gradetime',
      width: 70,
      render: gradetime => (
        <Tag color={gradetime ? 'green' : 'red'}>{gradetime ? '已' : '未'}评价</Tag>
      ),
    }, {
      title: '操作',
      key: 'operation',
      width: 120,
      render: (text, record) => (
        <DropMenu>
          <Menu onClick={({ key }) => handleMenuClick(key, record)}>
            {addDeletePower && <Menu.Item key={DELETE}>退课</Menu.Item>}
            {otherPower && <Menu.Item key={UPDATE}>评价</Menu.Item>}
            {otherPower && !uploadRecordStatus && <Menu.Item key={ADD}>上传录音</Menu.Item>}
            {otherPower && <Menu.Item key={DETAIL}>查看反馈</Menu.Item>}
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
    scroll: { x: 706 },
    dataSource: list,
    pagination: false,
    animate: false,
    size: 'small',
    rowKey: record => record.id,
  }

  const needExpanded = list.some(item => item.jl_song.song && item.jl_song.original_singer)
  if (needExpanded) {
    tableProps.defaultExpandAllRows = true
    tableProps.expandedRowRender = (record) => {
      const { jl_song: { song, original_singer: originalSinger, back_source: backSource } } = record
      if (song && originalSinger) {
        return (
          <div className={styles.text_left}>
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
      return false
    }
  }

  return (
    <Table {...tableProps} />
  )
}

List.propTypes = {
  uploadRecordStatus: PropTypes.bool.isRequired,
  lessonStudent: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  addDeletePower: PropTypes.bool.isRequired,
  otherPower: PropTypes.bool.isRequired,
  onDeleteItem: PropTypes.func.isRequired,
  onAttendance: PropTypes.func.isRequired,
  onShowModal: PropTypes.func.isRequired,
}

export default List
