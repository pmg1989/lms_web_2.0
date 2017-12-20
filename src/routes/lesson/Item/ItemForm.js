import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, InputNumber, Select, Spin, Button, Row, Col, Checkbox } from 'antd'
import { getSchool, getUserInfo } from 'utils'
import styles from './ItemForm.less'

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

  handleSubmit = (e) => {
    const { form: { validateFieldsAndScroll } } = this.props
    e.preventDefault()
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.openweekday = values.openweekday.sort().join(',')
        console.log(values)
      }
    })
  }

  render () {
    const {
      lessonItem: {
        item,
        courseCategorys,
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

    const courseCategorysProps = {
      showSearch: true,
      placeholder: '--请选择课程类型--',
      optionFilterProp: 'children',
      filterOption: (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0,
    }

    return (
      <Spin spinning={loading} size="large">
        <Form className={styles.form_box} onSubmit={this.handleSubmit}>
          <FormItem label="课程类型" {...formItemLayout} extra="支持关键字输入筛选">
            {getFieldDecorator('categoryid', {
              initialValue: item.categoryid,
              rules: [
                {
                  required: true,
                  message: '请输入课程类型',
                },
              ],
            })(<Select {...courseCategorysProps}>
              {courseCategorys.map(courseCategory => <Option key={courseCategory.id} value={courseCategory.id.toString()}>{courseCategory.description}</Option>)}
            </Select>)}
          </FormItem>
          {/* <FormItem label="课程编号" {...formItemLayout}>
            {getFieldDecorator('course_idnumber', {
              initialValue: item.course_idnumber,
              rules: [
                {
                  required: true,
                  message: '请输入课程名称',
                },
              ],
            })(<Input disabled={disabled} placeholder="请输入课程名称" />)}
          </FormItem> */}
          <FormItem label="校区" {...formItemLayout}>
            {getFieldDecorator('school_id', {
              initialValue: item.school_id || getUserInfo().school_id.toString(),
              onChange: this.handleSchoolChange,
            })(<Select disabled={getSchool() !== 'global'} placeholder="--请选择校区--">
              {schools.map(school => <Option key={school.id} value={school.id.toString()}>{school.name}</Option>)}
            </Select>)
            }
          </FormItem>
          <FormItem label="老师" {...formItemLayout}>
            {getFieldDecorator('teacherid', {
              // initialValue: '',
              rules: [
                {
                  required: true,
                  message: '请选择老师',
                },
              ],
            })(<Select disabled={disabled} placeholder="--请选择老师--">
              {teachers.map(teacher => <Option key={teacher.id} value={teacher.id.toString()}>{teacher.firstname}</Option>)}
            </Select>)
            }
          </FormItem>
          {/* <FormItem label="代课老师" {...formItemLayout}>
            {getFieldDecorator('teacher_substitute', {
              initialValue: item.teacher_substitute,
            })(<Input disabled={disabled} placeholder="请输入代课老师" />)
            }
          </FormItem> */}
          <FormItem label="教室" {...formItemLayout}>
            {getFieldDecorator('classroomid', {
              // initialValue: '',
              rules: [
                {
                  required: true,
                  message: '请选择教室',
                },
              ],
            })(<Select disabled={disabled} placeholder="--请选择教室--">
              {classrooms.map(classroom => <Option key={classroom.id} value={classroom.id.toString()}>{classroom.name}</Option>)}
            </Select>)
            }
          </FormItem>
          <FormItem label="工作日" hasFeedback {...formItemLayout}>
            {getFieldDecorator('openweekday', {
              initialValue: [],
              rules: [
                {
                  required: true,
                  message: '请选择工作日',
                },
              ],
            })(<Checkbox.Group disabled={disabled} placeholder="--请选择工作日--">
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
          </FormItem>
          <FormItem label="持续周数" {...formItemLayout}>
            {getFieldDecorator('numsections', {
              initialValue: item.numsections || 16,
            })(<InputNumber min={1} disabled={disabled} placeholder="请输入持续周数" />)
            }
          </FormItem>
          <FormItem wrapperCol={{ span: 17, offset: 4 }}>
            <Button className={styles.btn} type="primary" htmlType="submit" size="large">创建</Button>
            <Button className={styles.btn} type="default" size="large">返回</Button>
          </FormItem>
        </Form>
      </Spin>
    )
  }
}

export default Form.create()(ItemForm)
