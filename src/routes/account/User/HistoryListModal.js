import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Icon, Table } from 'antd'
import moment from 'moment'
import { getModalType } from 'utils/dictionary'

const ModalForm = ({
  modal: { curItem, type, visible },
  loading,
  onCancel,
}) => {
  const { name, icon } = getModalType(type)
  const modalFormOpts = {
    title: <div><Icon type={icon} /> {name} - 修改历史记录</div>,
    maskClosable: false,
    visible,
    width: 900,
    wrapClassName: 'vertical-center-modal',
    onCancel,
    footer: null,
  }

  const columns = [
    {
      title: '修改人',
      dataIndex: 'modify_caller',
      key: 'modify_caller',
    }, {
      title: '修改时间',
      dataIndex: 'modify_time',
      key: 'modify_time',
      render (modifyTime) {
        return <span>{moment.unix(modifyTime).format('YYYY-MM-DD HH:mm:ss')}</span>
      },
    },
    {
      title: '任课老师',
      dataIndex: 'teachername',
      key: 'teachername',
    },
    {
      title: '备注信息',
      dataIndex: 'modify_note',
      key: 'modify_note',
    },
    {
      title: '合同起止时间',
      dataIndex: 'available',
      key: 'available',
      render (available, record) {
        return <span>{record.available && moment.unix(record.available).format('YYYY-MM-DD')} ~ {record.deadline && moment.unix(record.deadline).format('YYYY-MM-DD')}</span>
      },
    },
  ]

  return (
    <Modal {...modalFormOpts}>
      <Table
        columns={columns}
        dataSource={curItem.historyList}
        loading={loading}
        rowKey={record => record.modify_time}
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
