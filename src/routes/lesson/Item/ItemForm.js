import React from 'react'
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

const ItemForm = ({
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
}) => {
  const disabled = false
  const teachers = teachersDic[item.school || getSchool()] || []
  const classrooms = classroomsDic[item.school_id || getUserInfo().school_id] || []

  // const renderUserId = () => {
  //   return (teachers.find(teacher => teacher.username === getUserInfo().uname) || {}).id
  // }

  // const renderClassRoomId = () => {
  //   return (classrooms.find(classroom => classroom.name === getUserInfo().uname) || {}).id
  // }

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
          {getFieldDecorator('school', {
            initialValue: item.school || getSchool(),
            // onChange: handleSchoolChange,
          })(<Select disabled={getSchool() !== 'global'}>
            {schools.map(school => <Option key={school.id} value={school.school}>{school.name}</Option>)}
          </Select>)
          }
        </FormItem>
        <FormItem label="老师" {...formItemLayout}>
          {getFieldDecorator('teacherid', {
            initialValue: '',
            // onChange: handleChange,
          })(<Select disabled={getUserInfo().rolename === 'teacher'}>
            {teachers.map(teacher => <Option key={teacher.id} value={teacher.id.toString()}>{teacher.firstname}</Option>)}
          </Select>)
          }
        </FormItem>
        <FormItem label="教室" {...formItemLayout}>
          {getFieldDecorator('classroomid', {
            initialValue: '',
            // onChange: handleChange,
          })(<Select disabled={getUserInfo().rolename === 'teacher'}>
            {classrooms.map(classroom => <Option key={classroom.id} value={classroom.id.toString()}>{classroom.name}</Option>)}
          </Select>)
          }
        </FormItem>
      </Form>
    </Spin>
  )
}

ItemForm.propTypes = {
  lessonItem: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
}

export default Form.create()(ItemForm)
