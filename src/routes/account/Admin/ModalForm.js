import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Modal, Icon, Select, Checkbox, Row, Col } from 'antd'
import { validPhone } from 'utils/utilsValid'
import { categorys, subjects, getModalType, roleNames } from 'utils/dictionary'

const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

class ModalForm extends Component {
  static propTypes = {
    modal: PropTypes.object.isRequired,
    loading: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    onOk: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
  }

  constructor (props) {
    super(props)
    this.state = {
      mySubjects: Object.entries(subjects),
      myLevelList: Array.from(Array(21).keys()),
      isTeacher: true,
    }
  }

  componentWillReceiveProps (nextProps) {
    if (!this.props.modal.curItem.teacher_category && nextProps.modal.curItem.teacher_category) {
      this.handleCategoryChange(nextProps.modal.curItem.teacher_category, false)
      this.handleSubjectChange(nextProps.modal.curItem.teacher_subject, false)
      // this.handleRoleChange(nextProps.modal.curItem.roleId)
    }
  }

  handleOk = () => {
    const { form: { validateFields }, modal: { curItem }, onOk } = this.props
    validateFields((errors, values) => {
      if (errors) {
        return
      }
      const data = values
      data.teacher_workday = values.teacher_workday.sort().join(',')
      if (curItem.id) {
        data.userid = curItem.id // 温馨提示： 记得到时候修改onOk里面 userid => id
        delete data.email
        data.teacher_classroom = data.teacher_classroom_name
        delete data.teacher_classroom_name
        delete data.rolename
      } else {
        data.password = data.phone2.substr(data.phone2.length - 6)

        data.phone = data.phone2
        delete data.phone2
        data.teacher_classroom = data.teacher_classroom_name
        delete data.teacher_classroom_name
      }
      onOk(data)
    })
  }

  handleRoleChange = (role) => {
    this.setState({ isTeacher: role === 'teacher' })
  }

  handleCategoryChange = (category, needSetValue = true) => {
    if (category === 'profession') {
      this.setState({
        mySubjects: Object.entries(subjects).filter(item => ['vocal', 'piano', 'guitar', 'theory', 'composition'].includes(item[0])),
      })
    } else if (category === 'hd') {
      this.setState({
        mySubjects: Object.entries(subjects).filter(item => ['yoga', 'rhythm'].includes(item[0])),
      })
    } else if (category === 'jl') {
      this.setState({
        mySubjects: Object.entries(subjects).filter(item => ['record'].includes(item[0])),
      })
    }
    needSetValue && this.props.form.setFieldsValue({
      teacher_subject: '',
      teacher_level: '',
    })
  }

  handleSubjectChange = (subject, needSetValue = true) => {
    if (['vocal', 'piano', 'guitar'].includes(subject)) {
      this.setState({
        myLevelList: Array.from(Array(21).keys()),
      })
    } else {
      this.setState({
        myLevelList: [],
      })
    }
    needSetValue && this.props.form.setFieldsValue({
      teacher_level: '',
    })
  }

  render () {
    const {
      modal: { curItem, type, visible },
      loading,
      form: {
        getFieldDecorator,
        resetFields,
      },
      onCancel,
    } = this.props
    const { mySubjects, myLevelList, isTeacher } = this.state

    if (!curItem.roleList) {
      curItem.roleList = []
    }
    if (!curItem.classRooms) {
      curItem.classRooms = []
    }
    const disabled = type === 'detail'
    const { name, icon } = getModalType(type)

    const modalFormOpts = {
      title: <div><Icon type={icon} /> {name} - 工作人员</div>,
      visible,
      wrapClassName: 'vertical-center-modal',
      confirmLoading: loading.effects['accountAdmin/showModal'],
      onOk: this.handleOk,
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
          <FormItem label="角色" hasFeedback {...formItemLayout}>
            {getFieldDecorator('rolename', {
              initialValue: curItem.rolename,
              rules: [
                {
                  required: true,
                  message: '请选择角色',
                },
              ],
              onChange: this.handleRoleChange,
            })(<Select disabled={disabled} placeholder="--请选择角色--">
              {Object.entries(roleNames).map(([key, value]) => {
                return <Option key={key} value={key}>{value}</Option>
              })}
            </Select>)}
          </FormItem>
          {isTeacher && <FormItem label="类别" hasFeedback {...formItemLayout}>
            {getFieldDecorator('teacher_category', {
              initialValue: curItem.teacher_category,
              rules: [
                {
                  required: true,
                  message: '请选择类别',
                },
              ],
              onChange: this.handleCategoryChange,
            })(<Select disabled={disabled} placeholder="--请选择类别--">
              {Object.entries(categorys).map(([key, value]) => {
                return <Option key={key} value={key}>{value}</Option>
              })}
            </Select>)}
          </FormItem>}
          {isTeacher && <FormItem label="科目" hasFeedback {...formItemLayout}>
            {getFieldDecorator('teacher_subject', {
              initialValue: curItem.teacher_subject,
              rules: [
                {
                  required: true,
                  message: '请选择科目',
                },
              ],
              onChange: this.handleSubjectChange,
            })(<Select disabled={disabled} placeholder="--请选择科目--">
              {mySubjects.map(([key, value]) => {
                return <Option key={key} value={key}>{value}</Option>
              })}
            </Select>)}
          </FormItem>}
          {isTeacher && <FormItem label="当前等级" hasFeedback {...formItemLayout}>
            {getFieldDecorator('teacher_level', {
              initialValue: curItem.teacher_level,
              rules: [
                {
                  required: true,
                  message: '请选择当前等级',
                },
              ],
            })(<Select disabled={disabled} placeholder="--请选择当前等级--">
              {myLevelList.map((levev, key) => {
                return <Option key={key} value={`V${levev + 1}`}>{`V${levev + 1}`}</Option>
              })}
              <Option value="other">other</Option>
            </Select>)}
          </FormItem>}
          {isTeacher && <FormItem label="保底课时" hasFeedback {...formItemLayout}>
            {getFieldDecorator('teacher_lessonsum_monthly', {
              initialValue: curItem.teacher_lessonsum_monthly || 30,
              rules: [
                {
                  required: true,
                  message: '请输入保底课时',
                },
              ],
            })(<InputNumber disabled={disabled} min={0} placeholder="请输入保底课时" />)}
          </FormItem>}
          {isTeacher && <FormItem label="教室" hasFeedback {...formItemLayout}>
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
          </FormItem>}
          {isTeacher && <FormItem label="工作日" hasFeedback {...formItemLayout}>
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
          </FormItem>}
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(ModalForm)
