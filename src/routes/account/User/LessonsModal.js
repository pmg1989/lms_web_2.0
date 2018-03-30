import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Icon, Table, Tabs } from 'antd'
import { Link } from 'dva/router'
import moment from 'moment'
import CirclePlayer from 'components/MediaPlayer/CirclePlayer'
import { getModalType } from 'utils/dictionary'

const TabPane = Tabs.TabPane

const ModalForm = ({
  modal: { curItem, type, visible },
  loading,
  onCancel,
  onCancelAll,
}) => {
  const { name, icon } = getModalType(type)
  const modalFormOpts = {
    title: <div><Icon type={icon} /> {name} - 课程记录</div>,
    maskClosable: false,
    visible,
    width: 900,
    wrapClassName: 'vertical-center-modal',
    onCancel,
    footer: null,
  }

  const columns = [
    {
      title: '课程名称',
      dataIndex: 'category_summary',
      key: 'category_summary',
      render (summary, record) {
        return <Link onClick={onCancelAll} to={`/lesson/update?lessonid=${record.id}`}>{summary}</Link>
      },
    }, {
      title: '任课老师',
      dataIndex: 'teacher_alternatename',
      key: 'teacher_alternatename',
      render (alternatename, record) {
        return <span>{alternatename}{record.teacher_substitute_alternatename && `（${record.teacher_substitute_alternatename}代上）`}</span>
      },
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
      title: '录音',
      dataIndex: 'jl_recording_url',
      key: 'jl_recording_url',
      render (url) {
        return <span>{url ? <CirclePlayer src={url} autoPlay={false} /> : '无'}</span>
      },
    },
  ]

  return (
    <Modal {...modalFormOpts}>
      <Tabs defaultActiveKey="1">
        <TabPane tab="已开课" key="1">
          <Table
            columns={columns}
            dataSource={curItem.lessons}
            loading={loading}
            rowKey={record => record.id}
          />
        </TabPane>
        <TabPane tab="预约中" key="2">
          <Table
            columns={columns}
            dataSource={curItem.lessons2}
            loading={loading}
            rowKey={record => record.id}
          />
        </TabPane>
      </Tabs>

    </Modal>
  )
}

ModalForm.propTypes = {
  loading: PropTypes.bool.isRequired,
  modal: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
  onCancelAll: PropTypes.func.isRequired,
}

export default ModalForm
