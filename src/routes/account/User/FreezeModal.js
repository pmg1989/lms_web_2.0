import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Modal, Icon, Table } from 'antd'
import { getModalType } from 'utils/dictionary'

const ModalForm = ({
  modal: { curItem, type, visible },
  loading,
  onCancel,
}) => {
  const { name, icon } = getModalType(type)
  const modalFormOpts = {
    title: <div><Icon type={icon} /> {name} - 查看冻结信息</div>,
    maskClosable: false,
    visible,
    width: 900,
    wrapClassName: 'vertical-center-modal',
    onCancel,
    footer: null,
  }

  const columns = [
    {
      title: '合同课程名称',
      dataIndex: 'category_summary',
      key: 'category_summary',
    }, {
      title: '合同起始时间',
      dataIndex: 'available',
      key: 'available',
      render (available) {
        return <span>{moment.unix(available).format('YYYY-MM-DD')}</span>
      },
    }, {
      title: '合同结束时间',
      dataIndex: 'deadline',
      key: 'deadline',
      render (deadline) {
        return <span>{moment.unix(deadline).format('YYYY-MM-DD')}</span>
      },
    }, {
      title: '冻结起始时间',
      dataIndex: 'freeze_start',
      key: 'freeze_start',
      render (freezeStart) {
        return <span>{moment.unix(freezeStart).format('YYYY-MM-DD')}</span>
      },
    }, {
      title: '冻结结束时间',
      dataIndex: 'freeze_end',
      key: 'freeze_end',
      render (freezeEnd) {
        return <span>{moment.unix(freezeEnd).format('YYYY-MM-DD')}</span>
      },
    },
  ]

  return (
    <Modal {...modalFormOpts}>
      <Table
        columns={columns}
        dataSource={curItem.list}
        loading={loading}
        rowKey={record => record.contractid}
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
