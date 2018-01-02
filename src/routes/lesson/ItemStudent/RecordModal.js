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
      values.studentid = curItem.id
      values.lessonid = curItem.lessonid
      onOk(values)
    })
  }

  const { name, icon } = getModalType(type)
  const modalFormOpts = {
    title: <div><Icon type={icon} /> {name} - 录音信息</div>,
    visible,
    wrapClassName: 'vertical-center-modal',
    confirmLoading: loading,
    onOk: handleOk,
    onCancel,
  }

  return (
    <Modal {...modalFormOpts}>
      <Form>
        <FormItem label="曲目名称" {...formItemLayout}>
          {getFieldDecorator('song', {
            initialValue: curItem.jl_song.song,
            rules: [
              {
                required: true,
                message: '请输入曲目名称',
              },
            ],
          })(<Input placeholder="请输入曲目名称" />)}
        </FormItem>
        <FormItem label="原唱" {...formItemLayout}>
          {getFieldDecorator('original_singer', {
            initialValue: curItem.jl_song.original_singer,
            rules: [
              {
                required: true,
                message: '请输入原唱',
              },
            ],
          })(<Input placeholder="请输入原唱" />)}
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
