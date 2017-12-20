import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select, Spin } from 'antd'
import { getSchool, getUserInfo } from 'utils'

const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 17,
  },
}

class ItemForm extends Component {
  static propTypes = {
    lessonItem: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
  }

  state = {
    schoolId: getUserInfo().school_id,
  }

  componentWillReceiveProps (nextProps) {
    if (!this.props.lessonItem.item.category_summary && nextProps.lessonItem.item.category_summary) {
      this.handleSchoolChange(nextProps.lessonItem.item.school_id, false)
    }
  }

  handleSchoolChange = (schoolId, needSetValue = true) => {
    this.setState({ schoolId })
    if (needSetValue) {
      this.props.form.setFieldsValue({ teacherid: undefined })
      this.props.form.setFieldsValue({ classroomid: undefined })
    }
  }

  render () {
    const {
      lessonItem: {
        item,
        schools,
        classroomsDic,
        teachersDic,
      },
      loading,
      form: {
        getFieldDecorator,
      },
    } = this.props
    const { schoolId } = this.state

    const disabled = false
    const teachers = teachersDic[schoolId] || []
    const classrooms = classroomsDic[schoolId] || []

    return (
      <Spin spinning={loading} size="large">
        <Form>
          <FormItem label="课程名称" {...formItemLayout}>
            {getFieldDecorator('category_summary', {
              initialValue: item.category_summary,
              rules: [
                {
                  required: true,
                  message: '请输入课程名称',
                },
              ],
            })(<Input disabled={disabled} placeholder="请输入课程名称" />)}
          </FormItem>
          <FormItem label="课程编号" {...formItemLayout}>
            {getFieldDecorator('course_idnumber', {
              initialValue: item.course_idnumber,
              rules: [
                {
                  required: true,
                  message: '请输入课程名称',
                },
              ],
            })(<Input disabled={disabled} placeholder="请输入课程名称" />)}
          </FormItem>
          <FormItem label="校区" {...formItemLayout}>
            {getFieldDecorator('school_id', {
              initialValue: item.school_id || getUserInfo().school_id.toString(),
              onChange: this.handleSchoolChange,
            })(<Select disabled={getSchool() !== 'global'}>
              {schools.map(school => <Option key={school.id} value={school.id.toString()}>{school.name}</Option>)}
            </Select>)
            }
          </FormItem>
          <FormItem label="老师" {...formItemLayout}>
            {getFieldDecorator('teacherid', {
              // initialValue: '',
            })(<Select disabled={getUserInfo().rolename === 'teacher'} placeholder="--请选择老师--">
              {teachers.map(teacher => <Option key={teacher.id} value={teacher.id.toString()}>{teacher.firstname}</Option>)}
            </Select>)
            }
          </FormItem>
          <FormItem label="代课老师" {...formItemLayout}>
            {getFieldDecorator('teacher_substitute', {
              initialValue: item.teacher_substitute,
            })(<Input disabled={disabled} placeholder="请输入代课老师" />)
            }
          </FormItem>
          <FormItem label="教室" {...formItemLayout}>
            {getFieldDecorator('classroomid', {
              // initialValue: '',
            })(<Select disabled={getUserInfo().rolename === 'teacher'} placeholder="--请选择教室--">
              {classrooms.map(classroom => <Option key={classroom.id} value={classroom.id.toString()}>{classroom.name}</Option>)}
            </Select>)
            }
          </FormItem>
        </Form>
      </Spin>
    )
  }
}

export default Form.create()(ItemForm)
