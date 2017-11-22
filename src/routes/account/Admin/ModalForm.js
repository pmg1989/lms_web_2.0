import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Modal, Icon, Select, Checkbox, Row, Col } from 'antd'
import { validPhone } from 'utils/utilsValid'
import { categorys, subjects, getModalType } from 'utils/dictionary'

const FormItem = Form.Item
const Option = Select.Option

const levelList = Array.from(Array(21).keys())

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
    resetFields,
  },
  onOk,
  onCancel,
}) => {
  if (!curItem.roleList) {
    curItem.roleList = []
  }
  if (!curItem.classRooms) {
    curItem.classRooms = []
  }
  const disabled = type === 'detail'
  const { name, icon } = getModalType(type)

  const handleOk = () => {
    validateFields((errors, values) => {
      if (errors) {
        return
      }
      const data = {
        ...values,
        id: curItem.id,
      }
      onOk(data)
    })
  }

  const modalFormOpts = {
    title: <div><Icon type={icon} /> {name} - 工作人员</div>,
    visible,
    wrapClassName: 'vertical-center-modal',
    confirmLoading: loading.effects['accountAdmin/showModal'],
    onOk: handleOk,
    onCancel,
    afterClose () {
      resetFields() // 必须项，编辑后如未确认保存，关闭时必须重置数据
    },
  }

  return (
    <Modal {...modalFormOpts}>
      <Form>
        <FormItem label="登录账号" hasFeedback {...formItemLayout}>
          {getFieldDecorator('username', {
            initialValue: curItem.username,
            rules: [
              {
                required: true,
                message: '请输入登录账号',
              },
            ],
          })(<Input disabled={disabled} placeholder="请输入登录账号" />)}
        </FormItem>
        <FormItem label="真实姓名" hasFeedback {...formItemLayout}>
          {getFieldDecorator('firstname', {
            initialValue: curItem.firstname,
            rules: [
              {
                required: true,
                message: '请输入真实姓名',
              },
            ],
          })(<Input disabled={disabled} placeholder="请输入真实姓名" />)}
        </FormItem>
        <FormItem label="手机号" hasFeedback {...formItemLayout}>
          {getFieldDecorator('phone2', {
            initialValue: curItem.phone2,
            rules: [
              {
                required: true,
                message: '请输入手机号码',
              },
              {
                validator: validPhone,
              },
            ],
          })(<Input disabled={disabled} placeholder="请输入手机号码" />)}
        </FormItem>
        <FormItem label="邮箱" hasFeedback {...formItemLayout}>
          {getFieldDecorator('email', {
            initialValue: curItem.email,
            rules: [
              {
                required: true,
                message: '请输入邮箱',
              },
              {
                type: 'email',
                message: '邮箱格式不正确',
              },
            ],
          })(<Input disabled={disabled} type="email" placeholder="请输入邮箱" />)}
        </FormItem>
        <FormItem label="保底课时" hasFeedback {...formItemLayout}>
          {getFieldDecorator('teacher_lessonsum_monthly', {
            initialValue: curItem.teacher_lessonsum_monthly || 30,
            rules: [
              {
                required: true,
                message: '请输入保底课时',
              },
            ],
          })(<InputNumber disabled={disabled} min={0} placeholder="请输入保底课时" />)}
        </FormItem>
        <FormItem label="角色" hasFeedback {...formItemLayout}>
          {getFieldDecorator('roleId', {
            initialValue: curItem.roleId && curItem.roleId.toString(),
            rules: [
              {
                required: true,
                message: '请选择角色',
              },
            ],
          })(<Select disabled={disabled} placeholder="--请选择角色--">{curItem.roleList.map(item => <Option key={item.id} value={item.id.toString()}>{item.name}</Option>)}</Select>)}
        </FormItem>
        <FormItem label="类别" hasFeedback {...formItemLayout}>
          {getFieldDecorator('teacher_category', {
            initialValue: curItem.teacher_category,
            rules: [
              {
                required: true,
                message: '请选择类别',
              },
            ],
          })(<Select disabled={disabled} placeholder="--请选择类别--">
            {Object.entries(categorys).map(([key, value]) => {
              return <Option key={key} value={key}>{value}</Option>
            })}
          </Select>)}
        </FormItem>
        <FormItem label="科目" hasFeedback {...formItemLayout}>
          {getFieldDecorator('teacher_subject', {
            initialValue: curItem.teacher_subject,
            rules: [
              {
                required: true,
                message: '请选择科目',
              },
            ],
          })(<Select disabled={disabled} placeholder="--请选择科目--">
            {Object.entries(subjects).map(([key, value]) => {
              return <Option key={key} value={key}>{value}</Option>
            })}
          </Select>)}
        </FormItem>
        <FormItem label="当前等级" hasFeedback {...formItemLayout}>
          {getFieldDecorator('teacher_level', {
            initialValue: curItem.teacher_level,
            rules: [
              {
                required: true,
                message: '请选择当前等级',
              },
            ],
          })(<Select disabled={disabled} placeholder="--请选择当前等级--">
            {levelList.map((levev, key) => {
              return <Option key={key} value={`V${levev + 1}`}>{`V${levev + 1}`}</Option>
            })}
            <Option value="other">other</Option>
          </Select>)}
        </FormItem>
        <FormItem label="教室" hasFeedback {...formItemLayout}>
          {getFieldDecorator('teacher_classroom_name', {
            initialValue: curItem.teacher_classroom_name,
            rules: [
              {
                required: true,
                message: '请选择教室',
              },
            ],
          })(<Select disabled={disabled} placeholder="--请选择教室--">
            {curItem.classRooms.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
          </Select>)}
        </FormItem>
        <FormItem label="工作日" hasFeedback {...formItemLayout}>
          {getFieldDecorator('teacher_workday', {
            initialValue: curItem.teacher_workday && curItem.teacher_workday.split(','),
            rules: [
              {
                required: true,
                message: '请选择工作日',
              },
            ],
          })(<Checkbox.Group disabled={disabled}>
            <Row>
              <Col span={6}><Checkbox value="1">周一</Checkbox></Col>
              <Col span={6}><Checkbox value="2">周二</Checkbox></Col>
              <Col span={6}><Checkbox value="3">周三</Checkbox></Col>
              <Col span={6}><Checkbox value="4">周四</Checkbox></Col>
              <Col span={6}><Checkbox value="5">周五</Checkbox></Col>
              <Col span={6}><Checkbox value="6">周六</Checkbox></Col>
              <Col span={6}><Checkbox value="7">周日</Checkbox></Col>
            </Row>
          </Checkbox.Group>)}
        </FormItem>
      </Form>
    </Modal>
  )
}

ModalForm.propTypes = {
  modal: PropTypes.object.isRequired,
  loading: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}

export default Form.create()(ModalForm)
