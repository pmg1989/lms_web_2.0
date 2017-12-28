import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Modal, Radio, Row, Col } from 'antd'
import { DataTable, DropMenu } from 'components'
import { ADD, UPDATE, DETAIL, DELETE } from 'constants/options'
import styles from './List.less'

const confirm = Modal.confirm

function List ({
  lessonStudent: {
    list,
  },
  loading,
  addDeletePower,
  otherPower,
  onDeleteItem,
  onAttendance,
}) {
  const handleMenuClick = (key, record) => {
    if (+key === DELETE) {
      confirm({
        title: '您确定要删除课程吗?',
        onOk () {
          onDeleteItem({ lessonid: record.id })
        },
      })
    }
  }

  const columns = [
    {
      title: '姓名',
      dataIndex: 'firstname',
      key: 'firstname',
      width: 280,
    }, {
      title: '考勤',
      dataIndex: 'acronym',
      key: 'acronym',
      width: 280,
      render: (acronym, record) => (
        <Radio.Group defaultValue={acronym} onChange={e => onAttendance({ status: e.target.value, userid: record.id })}>
          <Radio.Button value="P"><span className={styles.primary}>出席</span></Radio.Button>
          <Radio.Button value="L"><span className={styles.warning}>迟到</span></Radio.Button>
          <Radio.Button value="A"><span className={styles.danger}>缺席</span></Radio.Button>
        </Radio.Group>
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
            {otherPower && <Menu.Item key={ADD}>上传录音</Menu.Item>}
            {otherPower && <Menu.Item key={DETAIL}>查看反馈</Menu.Item>}
          </Menu>
        </DropMenu>
      ),
      // fixed: 'right'
    },
  ]

  const dataTableProps = {
    loading,
    columns,
    scroll: { x: 708 },
    dataSource: list,
    pagination: false,
    animate: false,
    size: 'small',
    rowKey: record => record.id,
  }

  dataTableProps.defaultExpandAllRows = true
  dataTableProps.expandedRowRender = (record) => {
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
            <Col span={24}>文件名：{record.jl_recording.name}</Col>
          </Row>
          <Row>
            <Col span={24}>
              <audio controls src={record.jl_recording.url}>
                <track kind="captions" />
              </audio>
            </Col>
          </Row>
        </div>
      )
    }
    return false
  }

  return (
    <DataTable {...dataTableProps} />
  )
}

List.propTypes = {
  lessonStudent: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  addDeletePower: PropTypes.bool.isRequired,
  otherPower: PropTypes.bool.isRequired,
  onDeleteItem: PropTypes.func.isRequired,
  onAttendance: PropTypes.func.isRequired,
}

export default List
