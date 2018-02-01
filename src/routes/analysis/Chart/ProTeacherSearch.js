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

class ProTeacherSearch extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    searchQuery: PropTypes.object.isRequired,
    schools: PropTypes.array.isRequired,
    onQuery: PropTypes.func.isRequired,
  }

  handleSchoolChange = () => {
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
    const { form: { getFieldDecorator }, schools, searchQuery: { school, deadline } } = this.props
    return (
      <Form layout="inline" style={{ marginBottom: 20 }}>
        <FormItem label="校区">
          {getFieldDecorator('school', {
            initialValue: school,
            onChange: this.handleSchoolChange,
          })(<Select style={{ width: 90 }} disabled={getSchool() !== 'global'}>
            {/* <Option value="">全国</Option> */}
            {schools.map(item => <Option key={item.id} value={item.school}>{item.name}</Option>)}
          </Select>)
          }
        </FormItem>
        <FormItem label="合同开始日期至">
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

export default Form.create()(ProTeacherSearch)
