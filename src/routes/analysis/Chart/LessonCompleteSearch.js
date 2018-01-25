import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DatePicker, Form, Select } from 'antd'
import moment from 'moment'
import { getSchool } from 'utils'

const FormItem = Form.Item
const { MonthPicker } = DatePicker
const Option = Select.Option

const defaultDeadline = moment().endOf('day')
const curMonth = moment().endOf('month').format('x')

function disabledDate (current) {
  return current && current.valueOf() > curMonth
}

class LessonCompleteSearch extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    searchQuery: PropTypes.object.isRequired,
    schools: PropTypes.array.isRequired,
    onQuery: PropTypes.func.isRequired,
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

  handleSchoolChange = () => {
    this.props.form.setFieldsValue({
      type: 'month',
      deadline: defaultDeadline,
    })
    this.handleChange(true)
  }

  handleTypeChange = (value) => {
    if (value === 'month') {
      this.props.form.setFieldsValue({
        deadline: defaultDeadline,
      })
    }
    this.handleChange(false)
  }

  handleDeadlineChange = () => {
    this.handleChange(false)
  }

  render () {
    const { form: { getFieldDecorator }, schools, searchQuery: { school, type, deadline } } = this.props

    return (
      <Form layout="inline" style={{ marginBottom: 20 }}>
        <FormItem label="校区">
          {getFieldDecorator('school', {
            initialValue: school,
            onChange: this.handleSchoolChange,
          })(<Select style={{ width: 120 }} disabled={getSchool() !== 'global'}>
            {schools.map(item => <Option key={item.id} value={item.school}>{item.name}</Option>)}
          </Select>)
          }
        </FormItem>
        <FormItem label="类型">
          {getFieldDecorator('type', {
            initialValue: type,
            onChange: this.handleTypeChange,
          })(<Select style={{ width: 120 }}>
            <Option value="month">按月份</Option>
            <Option value="day">按天</Option>
          </Select>)
          }
        </FormItem>
        <FormItem label="日期">
          {getFieldDecorator('deadline', {
            initialValue: moment.unix(deadline),
            onChange: this.handleDeadlineChange,
          })(
            <MonthPicker disabled={type === 'month'} allowClear={false} disabledDate={disabledDate} placeholder="--请选择月份--" />
          )}
        </FormItem>
      </Form>
    )
  }
}

export default Form.create()(LessonCompleteSearch)
