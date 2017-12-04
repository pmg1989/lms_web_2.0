import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Icon } from 'antd'
import { getModalType } from 'utils/dictionary'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 17,
  },
}

const ModalForm = ({
  modal: { curItem, type, visible },
  loading,
  onCancel,
  form: {
    getFieldDecorator,
  },
}) => {
  const { name, icon } = getModalType(type)
  const modalFormOpts = {
    title: <div><Icon type={icon} /> {name} - 设置任课老师</div>,
    visible,
    maskClosable: false,
    width: 600,
    wrapClassName: 'vertical-center-modal',
    confirmLoading: loading.models.accountUser,
    onCancel,
    footer: null,
  }

  return (
    <Modal {...modalFormOpts}>
      <Form>
        <FormItem label="用户名" {...formItemLayout}>
          {getFieldDecorator('username', {
            initialValue: curItem.username,
          })(<Input disabled />)}
        </FormItem>
      </Form>
    </Modal>
  )
}

ModalForm.propTypes = {
  modal: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  loading: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
}

export default Form.create()(ModalForm)
