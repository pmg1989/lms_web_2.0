import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Icon, Spin } from 'antd'
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
  },
  onCancel,
}) => {
  const { name, icon } = getModalType(type)
  const modalFormOpts = {
    title: <div><Icon type={icon} /> {name} - 评价</div>,
    visible,
    wrapClassName: 'vertical-center-modal',
    onCancel,
    footer: null,
  }

  return (
    <Modal {...modalFormOpts}>
      <Spin size="large" spinning={loading}>
        <Form>
          <FormItem label="建议与意见(针对教学内容)" {...formItemLayout}>
            {getFieldDecorator('lesson_suggestion', {
              initialValue: curItem.lesson_suggestion,
            })(<TextArea disabled rows={4} />)}
          </FormItem>
          <FormItem label="对老师的评价(针对老师)" {...formItemLayout}>
            {getFieldDecorator('teacher_suggestion', {
              initialValue: curItem.teacher_suggestion,
            })(<TextArea disabled rows={4} />)}
          </FormItem>
        </Form>
      </Spin>
    </Modal>
  )
}

ModalForm.propTypes = {
  modal: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
}

export default Form.create()(ModalForm)
