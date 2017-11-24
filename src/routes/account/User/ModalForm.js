import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Icon } from 'antd'
import { getModalType } from 'utils/dictionary'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
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
    title: <div><Icon type={icon} /> {name} - 学员</div>,
    visible,
    width: 800,
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
        <FormItem label="真实姓名" {...formItemLayout}>
          {getFieldDecorator('firstname', {
            initialValue: curItem.firstname,
          })(<Input disabled />)}
        </FormItem>
        <FormItem label="手机号" {...formItemLayout}>
          {getFieldDecorator('phone2', {
            initialValue: curItem.phone2,
          })(<Input disabled />)}
        </FormItem>
        <FormItem label="校区" {...formItemLayout}>
          {getFieldDecorator('school', {
            initialValue: curItem.school,
          })(<Input disabled />)}
        </FormItem>
        <FormItem label="学号" {...formItemLayout}>
          {getFieldDecorator('idnumber', {
            initialValue: curItem.idnumber,
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
