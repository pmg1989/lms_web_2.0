import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Icon, DatePicker, Input } from 'antd'
import moment from 'moment'
import { getModalType } from 'utils/dictionary'

const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker

// const format = 'YYYY-MM-DD HH:mm:ss'

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
  form: {
    getFieldDecorator,
    validateFields,
  },
  onOk,
  onCancel,
}) => {
  function handleOk () {
    validateFields((errors, values) => {
      if (errors) {
        return
      }
      const data = {
        available: values.available,
        teacherid: curItem.id,
      }
      const rangeValue = values.available
      if (rangeValue.length) {
        data.available = moment(rangeValue[0].format('YYYY-MM-DD')).valueOf() / 1000
        data.deadline = moment(rangeValue[1].format('YYYY-MM-DD')).valueOf() / 1000
      }
      onOk(data)
    })
  }

  const { icon } = getModalType(type)

  const modalFormOpts = {
    title: <div><Icon type={icon} />申请请假</div>,
    maskClosable: false,
    visible,
    wrapClassName: 'vertical-center-modal',
    confirmLoading: loading,
    onOk: handleOk,
    onCancel,
  }

  return (
    <Modal {...modalFormOpts}>
      <Form>
        <FormItem label="老师姓名" hasFeedback {...formItemLayout}>
          {getFieldDecorator('firstname', {
            initialValue: curItem.firstname,
          })(<Input disabled />)}
        </FormItem>
        <FormItem label="请假时间" hasFeedback {...formItemLayout}>
          {getFieldDecorator('available', {
            initialValue: '',
            rules: [
              {
                required: true,
                message: '请选择请假时间',
              },
            ],
          })(<RangePicker />)}
        </FormItem>
      </Form>
    </Modal>
  )
}

ModalForm.propTypes = {
  modal: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}

export default Form.create()(ModalForm)
