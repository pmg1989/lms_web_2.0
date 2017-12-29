import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Icon, Spin, Rate, Row, Col } from 'antd'
import { getModalType } from 'utils/dictionary'
import styles from './FeedbackModal.less'

const FormItem = Form.Item
const { TextArea } = Input

const starsText = {
  0: '未评价',
  1: '不满意',
  2: '不太满意',
  3: '满意',
  4: '很满意',
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
        <Row>
          <Col span={20} offset={2}>
            <Form layout="vertical">
              <h3>1 老师满意度</h3><br />
              <Row>
                <Col offset={1}>
                  <FormItem label="1.1 老师课前教学准备充分度">
                    {getFieldDecorator('lesson_prepare_score', {
                      initialValue: curItem.lesson_prepare_score,
                    })(<Rate disabled count={4} />)}
                    {<span className={styles.star_text}>{starsText[curItem.lesson_prepare_score]}</span>}
                  </FormItem>
                  <FormItem label="1.2 本课内容设计满意度">
                    {getFieldDecorator('lesson_content_score', {
                      initialValue: curItem.lesson_content_score,
                    })(<Rate disabled count={4} />)}
                    {<span className={styles.star_text}>{starsText[curItem.lesson_content_score]}</span>}
                  </FormItem>
                  <FormItem label="1.3 老师课堂形象满意度">
                    {getFieldDecorator('teacher_appearance_score', {
                      initialValue: curItem.teacher_appearance_score,
                    })(<Rate disabled count={4} />)}
                    {<span className={styles.star_text}>{starsText[curItem.teacher_appearance_score]}</span>}
                  </FormItem>
                  <FormItem label="1.4 与老师有良好的互动">
                    {getFieldDecorator('lesson_interaction_score', {
                      initialValue: curItem.lesson_interaction_score,
                    })(<Rate disabled count={4} />)}
                    {<span className={styles.star_text}>{starsText[curItem.lesson_interaction_score]}</span>}
                  </FormItem>
                  <FormItem label="1.5 老师讲课表达能力">
                    {getFieldDecorator('teacher_expression_score', {
                      initialValue: curItem.teacher_expression_score,
                    })(<Rate disabled count={4} />)}
                    {<span className={styles.star_text}>{starsText[curItem.teacher_expression_score]}</span>}
                  </FormItem>
                </Col>
              </Row>
              <FormItem label="2 建议与意见(针对教学内容)">
                {getFieldDecorator('lesson_suggestion', {
                  initialValue: curItem.lesson_suggestion,
                })(<TextArea disabled rows={4} />)}
              </FormItem>
              <FormItem label="3 对老师的评价(针对老师)">
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
