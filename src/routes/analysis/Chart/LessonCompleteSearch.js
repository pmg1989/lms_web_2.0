import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DatePicker, Form, Select } from 'antd'
import moment from 'moment'
import { getSchool } from 'utils'

const FormItem = Form.Item
const { MonthPicker } = DatePicker
const Option = Select.Option

const defaultDeadline = moment().endOf('month')
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
    data: PropTypes.object.isRequired,
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
      idNumber: 'all',
      deadline: defaultDeadline,
    })
    this.handleChange(true)
  }

  handleNameChange = () => {
    this.handleChange(false)
  }

  handleDeadlineChange = () => {
    this.handleChange(true)
  }

  render () {
    const { form: { getFieldDecorator }, schools, data, searchQuery: { school, idNumber, deadline } } = this.props
    const idNumbers = Object.keys(data).filter(item => item !== 'all')

    const studentsProps = {
      showSearch: true,
      placeholder: '--请选择学生--',
      optionFilterProp: 'children',
      filterOption: (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0,
    }

    return (
      <Form layout="inline" style={{ marginBottom: 20 }}>
        <FormItem label="校区">
          {getFieldDecorator('school', {
            initialValue: school,
            onChange: this.handleSchoolChange,
          })(<Select style={{ width: 120 }} disabled={getSchool() !== 'global'}>
            <Option value="">全国</Option>
            {schools.map(item => <Option key={item.id} value={item.school}>{item.name}</Option>)}
          </Select>)
          }
        </FormItem>
        <FormItem label="学生">
          {getFieldDecorator('idNumber', {
            initialValue: idNumber,
            onChange: this.handleNameChange,
          })(<Select style={{ width: 150 }} {...studentsProps}>
            <Option value="all">全部</Option>
            {idNumbers.map((item, key) => <Option key={key} value={item}>{data[item].student_name}</Option>)}
          </Select>)
          }
        </FormItem>
        <FormItem label="合同开始日期至">
          {getFieldDecorator('deadline', {
            initialValue: moment.unix(deadline),
            onChange: this.handleDeadlineChange,
          })(
            <MonthPicker allowClear={false} disabledDate={disabledDate} placeholder="--请选择月份--" />
          )}
        </FormItem>
      </Form>
    )
  }
}

export default Form.create()(LessonCompleteSearch)
