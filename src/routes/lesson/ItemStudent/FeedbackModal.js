import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Icon, Spin, Row, Col } from 'antd'
import { getModalType } from 'utils/dictionary'

const FormItem = Form.Item
const { TextArea } = Input

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
        <Row>
          <Col span={20} offset={2}>
            <Form layout="vertical">
              <FormItem label="建议与意见(针对教学内容)">
                {getFieldDecorator('lesson_suggestion', {
                  initialValue: curItem.lesson_suggestion,
                })(<TextArea disabled rows={4} />)}
              </FormItem>
              <FormItem label="对老师的评价(针对老师)">
                {getFieldDecorator('teacher_suggestion', {
                  initialValue: curItem.teacher_suggestion,
                })(<TextArea disabled rows={4} />)}
              </FormItem>
            </Form>
          </Col>
        </Row>
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
