import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Icon, Tabs, Spin } from 'antd'
import { getModalType } from 'utils/dictionary'
import ContractList from './ContractList'

const FormItem = Form.Item
const TabPane = Tabs.TabPane

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
  ...contractListProps
}) => {
  const { name, icon } = getModalType(type)
  const modalFormOpts = {
    title: <div><Icon type={icon} /> {name} - 学员</div>,
    visible,
    maskClosable: false,
    width: 800,
    wrapClassName: 'vertical-center-modal',
    onCancel,
    footer: null,
  }

  const { contractList } = curItem

  return (
    <Modal {...modalFormOpts}>
      <Spin size="large" spinning={loading.effects['accountUser/showModal']}>
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
          <FormItem label="报名课程" {...formItemLayout}>
            {contractList &&
            <Tabs defaultActiveKey="1" size="small">
              <TabPane tab={<span><Icon type="clock-circle-o" />正在学习</span>} key="1">
                <ContractList status={1} list={contractList.studinglist} {...contractListProps} />
              </TabPane>
              <TabPane tab={<span><Icon type="question-circle-o" />待开课</span>} key="2">
                <ContractList status={0} list={contractList.comminglist} {...contractListProps} />
              </TabPane>
              <TabPane tab={<span><Icon type="check-circle-o" /> 已结课</span>} key="3">
                <ContractList status={2} list={contractList.passedlist} {...contractListProps} />
              </TabPane>
            </Tabs>}
          </FormItem>
        </Form>
      </Spin>
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
