import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Icon } from 'antd'
import { getModalType } from 'utils/dictionary'

const FormItem = Form.Item
const { TextArea } = Input

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
      values.userid = curItem.userid
      onOk(values)
    })
  }

  const { name, icon } = getModalType(type)
  const modalFormOpts = {
    title: <div><Icon type={icon} /> {name} - 评价</div>,
    visible,
    wrapClassName: 'vertical-center-modal',
    confirmLoading: loading,
    onOk: handleOk,
    onCancel,
  }

  return (
    <Modal {...modalFormOpts}>
      <Form>
        <FormItem label="教师笔记" {...formItemLayout}>
          {getFieldDecorator('feedback_comment_lesson', {
            initialValue: curItem.lesson,
            rules: [
              {
                required: true,
                message: '请输入教师笔记',
              },
            ],
          })(<TextArea rows={4} placeholder="请输入教师笔记" />)}
        </FormItem>
        <FormItem label="课后评价" {...formItemLayout}>
          {getFieldDecorator('feedback_comment_student', {
            initialValue: curItem.student,
            rules: [
              {
                required: true,
                message: '请输入课后评价',
              },
            ],
          })(<TextArea rows={4} placeholder="请输入课后评价" />)}
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
