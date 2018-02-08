import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Icon, Tabs, Table } from 'antd'
import moment from 'moment'

const TabPane = Tabs.TabPane

const ModalForm = ({
  modal: { curItem, visible },
  onCancel,
}) => {
  const modalFormOpts = {
    title: '排课结果列表',
    maskClosable: false,
    visible,
    wrapClassName: 'vertical-center-modal',
    width: 800,
    onCancel,
    footer: null,
  }

  const columns1 = [
    {
      title: '任课老师',
      dataIndex: 'teacher',
      key: 'teacher',
    }, {
      title: '上课时间',
      dataIndex: 'available',
      key: 'available',
      render (available, record) {
        return <span>{moment.unix(available).format('YYYY-MM-DD HH:mm')} ~ {moment.unix(record.deadline).format('HH:mm')}</span>
      },
    }, {
      title: '教室',
      dataIndex: 'classroom',
      key: 'classroom',
    },
  ]

  const columns2 = [
    {
      title: '学员姓名',
      dataIndex: 'studentname',
      key: 'studentname',
    }, {
      title: '上课时间',
      dataIndex: 'available',
      key: 'available',
      render (available, record) {
        return <span>{moment.unix(available).format('YYYY-MM-DD HH:mm')} ~ {moment.unix(record.deadline).format('HH:mm')}</span>
      },
    }, {
      title: '失败原因',
      dataIndex: 'msg',
      key: 'msg',
    },
  ]

  const columns3 = [
    {
      title: '任课老师',
      dataIndex: 'teacher',
      key: 'teacher',
    }, {
      title: '上课时间',
      dataIndex: 'available',
      key: 'available',
      render (available, record) {
        return <span>{moment.unix(available).format('YYYY-MM-DD HH:mm')} ~ {moment.unix(record.deadline).format('HH:mm')}</span>
      },
    }, {
      title: '教室',
      dataIndex: 'classroom',
      key: 'classroom',
    }, {
      title: '冲突原因',
      dataIndex: 'msg',
      key: 'msg',
      render (status) {
        return <span>{{ 10101: '教室冲突', 10102: '老师冲突', 10103: '学员冲突' }[status] || '未知原因'}</span>
      },
    },
  ]

  const columns4 = [
    {
      title: '上课时间',
      dataIndex: 'available',
      key: 'available',
      render (available, record) {
        return <span>{moment.unix(available).format('YYYY-MM-DD HH:mm')} ~ {moment.unix(record.deadline).format('HH:mm')}</span>
      },
    },
  ]

  return (
    <Modal {...modalFormOpts}>
      <Tabs defaultActiveKey="1">
        <TabPane tab={<span><Icon type="check-circle-o" />成功列表</span>} key="1">
          <Table
            columns={columns1}
            dataSource={curItem.successlesson}
            rowKey={record => record.section}
            pagination={false}
          />
        </TabPane>
        <TabPane tab={<span><Icon type="close-circle-o" />添加学员失败列表</span>} key="2">
          <Table
            columns={columns2}
            dataSource={curItem.badenrollment}
            rowKey={record => record.available}
            pagination={false}
          />
        </TabPane>
        <TabPane tab={<span><Icon type="exclamation-circle-o" />冲突列表</span>} key="3">
          <Table
            columns={columns3}
            dataSource={curItem.conflictlesson}
            rowKey={record => record.available}
            pagination={false}
          />
        </TabPane>
        <TabPane tab={<span><Icon type="close-circle-o" />失败列表</span>} key="4">
          <Table
            columns={columns4}
            dataSource={curItem.faillist}
            rowKey={record => record.available}
            pagination={false}
          />
        </TabPane>
      </Tabs>
    </Modal>
  )
}

ModalForm.propTypes = {
  modal: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
}

export default ModalForm
