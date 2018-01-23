import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DatePicker, Form, Select } from 'antd'
import moment from 'moment'
import { getSchool } from 'utils'

const FormItem = Form.Item
const { MonthPicker } = DatePicker
const Option = Select.Option

class LessonSearch extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    schools: PropTypes.array.isRequired,
    teachersDic: PropTypes.object.isRequired,
    onQuery: PropTypes.func.isRequired,
  }

  state = {
    teachers: this.props.teachersDic[getSchool()] || [],
  }

  handleSchoolChange = (school) => {
    const { form: { setFieldsValue }, teachersDic } = this.props
    setFieldsValue({ name: 'all' })
    this.setState({ teachers: teachersDic[school] || [] })
    this.handleChange()
  }

  handleChange = (isPostBack = true) => {
    const { form: { getFieldsValue }, onQuery } = this.props
    setTimeout(() => {
      const params = getFieldsValue()
      params.deadline = params.deadline.endOf('month').format('X')
      params.isPostBack = isPostBack
      onQuery(params)
    }, 0)
  }

  render () {
    const { form: { getFieldDecorator }, schools } = this.props
    const { teachers } = this.state

    return (
      <Form layout="inline" style={{ marginBottom: 20 }}>
        <FormItem label="校区">
          {getFieldDecorator('school', {
            initialValue: getSchool(),
            onChange: this.handleSchoolChange,
          })(<Select style={{ width: 90 }} disabled={getSchool() !== 'global'}>
            {schools.map(item => <Option key={item.id} value={item.school}>{item.name}</Option>)}
          </Select>)
          }
        </FormItem>
        <FormItem label="老师">
          {getFieldDecorator('name', {
            initialValue: 'all',
            onChange: () => this.handleChange(false),
          })(<Select style={{ width: 150 }}>
            <Option value="all">全部</Option>
            {teachers.map(item => <Option key={item.id} value={item.firstname}>{item.alternatename}</Option>)}
          </Select>)
          }
        </FormItem>
        <FormItem>
          {getFieldDecorator('deadline', {
            initialValue: moment().subtract(1, 'month'),
            onChange: this.handleChange,
          })(
            <MonthPicker placeholder="--请选择月份--" />
          )}
        </FormItem>
      </Form>
    )
  }
}

export default Form.create()(LessonSearch)
