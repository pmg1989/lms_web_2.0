import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DatePicker, Form, Select } from 'antd'
import moment from 'moment'
import { getSchool } from 'utils'

const FormItem = Form.Item
const { MonthPicker } = DatePicker
const Option = Select.Option

const curMonth = moment().endOf('month').format('x')

function disabledDate (current) {
  return current && current.valueOf() > curMonth
}

class LessonSearch extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    searchQuery: PropTypes.object.isRequired,
    schools: PropTypes.array.isRequired,
    teachersDic: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    onQuery: PropTypes.func.isRequired,
  }

  state = {
    teachers: this.props.teachersDic[this.props.searchQuery.school] || [],
  }

  componentWillReceiveProps () {
    if (!this.state.teachers.length && Object.keys(this.props.teachersDic).length) {
      const teachersState = this.props.teachersDic[getSchool()] || []
      teachersState.length && this.setState({ teachers: teachersState })
    }
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
    const { form: { getFieldDecorator }, schools, searchQuery: { school, name, deadline }, data } = this.props
    // const { teachers } = this.state
    const teachers = Object.keys(data).filter(item => item !== 'all')
    return (
      <Form layout="inline" style={{ marginBottom: 20 }}>
        <FormItem label="校区">
          {getFieldDecorator('school', {
            initialValue: school,
            onChange: this.handleSchoolChange,
          })(<Select style={{ width: 90 }} disabled={getSchool() !== 'global'}>
            <Option value="">全国</Option>
            {schools.map(item => <Option key={item.id} value={item.school}>{item.name}</Option>)}
          </Select>)
          }
        </FormItem>
        <FormItem label="老师">
          {getFieldDecorator('name', {
            initialValue: name,
            onChange: () => this.handleChange(false),
          })(<Select style={{ width: 150 }}>
            <Option value="all">全部</Option>
            {teachers.map((item, key) => <Option key={key} value={item}>{item}</Option>)}
            {/* {teachers.map(item => <Option key={item.id} value={item.firstname}>{item.alternatename}</Option>)} */}
          </Select>)
          }
        </FormItem>
        <FormItem label="日期">
          {getFieldDecorator('deadline', {
            initialValue: moment.unix(deadline),
            onChange: this.handleChange,
          })(
            <MonthPicker allowClear={false} disabledDate={disabledDate} placeholder="--请选择月份--" />
          )}
        </FormItem>
      </Form>
    )
  }
}

export default Form.create()(LessonSearch)
