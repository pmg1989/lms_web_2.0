import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Icon, Table } from 'antd'
import moment from 'moment'
import CirclePlayer from 'components/MediaPlayer/CirclePlayer'
import { getModalType } from 'utils/dictionary'

const ModalForm = ({
  modal: { curItem, type, visible },
  loading,
  onCancel,
}) => {
  const { name, icon } = getModalType(type)
  const modalFormOpts = {
    title: <div><Icon type={icon} /> {name} - 课程记录</div>,
    visible,
    maskClosable: false,
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
    }, {
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
      <Table
        columns={columns}
        dataSource={curItem.lessons}
        loading={loading}
        rowKey={record => record.id}
      />
    </Modal>
  )
}

ModalForm.propTypes = {
  loading: PropTypes.bool.isRequired,
  modal: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
}

export default ModalForm
