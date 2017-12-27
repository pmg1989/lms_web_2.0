import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Modal, Icon, Select, Checkbox, Row, Col } from 'antd'
import { getSchool, getUserInfo } from 'utils'
import { InputEmail } from 'components'
import { validPhone } from 'utils/utilsValid'
import { roleNames, categorys, subjects, getModalType } from 'utils/dictionary'

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
    schools: PropTypes.array.isRequired,
    modal: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
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
      schoolId: getUserInfo().school_id,
    }
  }

  componentWillReceiveProps (nextProps) {
    if (!this.props.modal.curItem.teacher_category && nextProps.modal.curItem.teacher_category) {
      this.handleCategoryChange(nextProps.modal.curItem.teacher_category, false)
      this.handleSubjectChange(nextProps.modal.curItem.teacher_subject, false)
      this.handleSchoolChange(nextProps.modal.curItem.school, false)
      this.handleRoleChange(nextProps.modal.curItem.rolename)
    }
  }

  handleOk = () => {
    const { form: { validateFields }, modal: { curItem }, onOk } = this.props
    validateFields((errors, values) => {
      if (errors) {
        return
      }
      const data = values
      if (values.rolename === 'teacher') {
        data.teacher_workday = values.teacher_workday.sort().join(',')
      }
      if (curItem.id) {
        data.id = curItem.id
        delete data.email
        delete data.school
        delete data.rolename
      } else {
        data.password = data.phone2.substr(data.phone2.length - 6)
      }
      onOk(data)
    })
  }

  handleSchoolChange = (school, needSetValue = true) => {
    const schoolId = this.props.schools.find(item => item.school === school).id
    this.setState({ schoolId })
    needSetValue && this.props.form.setFieldsValue({ teacher_classroom_id: undefined })
  }

  handleRoleChange = (rolename) => {
    this.setState({ isTeacher: rolename === 'teacher' })
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
      teacher_subject: undefined,
      teacher_level: undefined,
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
      teacher_level: undefined,
    })
  }

  render () {
    const {
      schools,
      modal: { curItem, type, visible },
      loading,
      form: {
        getFieldDecorator,
      },
      onCancel,
    } = this.props
    const { mySubjects, myLevelList, isTeacher, schoolId } = this.state

    // if (!curItem.roleList) {
    //   curItem.roleList = []
    // }
    if (!curItem.classRooms) {
      curItem.classRooms = []
    }
    const disabled = type === 'detail'
    const { name, icon } = getModalType(type)

    const modalFormOpts = {
      title: <div><Icon type={icon} /> {name} - 工作人员</div>,
      visible,
      maskClosable: false,
      wrapClassName: 'vertical-center-modal',
      confirmLoading: loading,
      onOk: this.handleOk,
      onCancel,
    }
    if (disabled) {
      modalFormOpts.footer = null
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
          <FormItem label="手机号" hasFeedback {...formItemLayout} extra={type === 'create' && '新建工作人员时，初始密码默认值是手机号码后六位'}>
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
            })(<InputEmail disabled={disabled || type === 'update'} />)}
          </FormItem>
          <FormItem label="校区" hasFeedback {...formItemLayout}>
            {getFieldDecorator('school', {
              initialValue: curItem.school || getSchool(),
              rules: [
                {
                  required: true,
                  message: '请选择校区',
                },
              ],
              onChange: this.handleSchoolChange,
            })(<Select disabled={disabled || type === 'update' || getSchool() !== 'global'} placeholder="--请选择校区--">
              {schools.map((item, key) => {
                return <Option key={key} value={item.school}>{item.name}</Option>
              })}
            </Select>)}
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
            })(<Select disabled={disabled || type === 'update'} placeholder="--请选择角色--">
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
            {getFieldDecorator('teacher_classroom_id', {
              initialValue: curItem.teacher_classroom_id,
              rules: [
                {
                  required: true,
                  message: '请选择教室',
                },
              ],
            })(<Select disabled={disabled} placeholder="--请选择教室--">
              {curItem.classRooms[schoolId] && curItem.classRooms[schoolId].map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
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
                <Col span={6}><Checkbox value="0">周日</Checkbox></Col>
              </Row>
            </Checkbox.Group>)}
          </FormItem>}
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(ModalForm)
