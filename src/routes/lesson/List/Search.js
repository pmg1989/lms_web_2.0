import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'dva/router'
import moment from 'moment'
import { Form, Row, Col, Button, Select, Icon, DatePicker } from 'antd'
import { getSchool, getUserInfo } from 'utils'

const FormItem = Form.Item
const Option = Select.Option
const RangePicker = DatePicker.RangePicker

const Search = ({
  addPower,
  searchQuery,
  schools,
  categorys,
  teachersDic,
  onSearch,
  form: {
    getFieldDecorator,
    setFieldsValue,
    getFieldsValue,
  },
}) => {
  const handleChange = () => {
    setTimeout(() => {
      const { available, ...fieldsValue } = getFieldsValue()
      onSearch({
        ...fieldsValue,
        available: available[0].format('X'),
        deadline: available[1].format('X'),
      })
    }, 0)
  }

  const handleSchoolChange = () => {
    setFieldsValue({ userid: '' })
    handleChange()
  }

  const teachers = teachersDic[searchQuery.school || getSchool()] || []

  const renderUserId = () => {
    return (teachers.find(item => item.username === getUserInfo().uname) || {}).id
  }

  const renderRangeDate = (available, deadline) => {
    if (available && deadline) {
      return [moment(moment.unix(available).format('YYYY-MM-DD')).startOf('month'), moment(moment.unix(deadline).format('YYYY-MM-DD')).endOf('month')]
    }
    return [moment().startOf('month'), moment().endOf('month')]
  }

  const rangePickerProps = {
    ranges: {
      今天: [moment().startOf('day'), moment().endOf('day')],
      当前月: [moment().startOf('month'), moment().endOf('month')],
      昨天: [moment().subtract(1, 'day').startOf('day'), moment().subtract(1, 'day').endOf('day')],
      明天: [moment().add(1, 'day').startOf('day'), moment().add(1, 'day').endOf('day')],
      上个月: [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
      下个月: [moment().add(1, 'month').startOf('month'), moment().add(1, 'month').endOf('month')] },
  }

  return (
    <Row gutter={24}>
      <Col>
        <Form layout="inline">
          <FormItem label="校区" style={{ marginBottom: 20, marginRight: 40 }}>
            {getFieldDecorator('school', {
              initialValue: searchQuery.school || getSchool(),
              onChange: handleSchoolChange,
            })(<Select style={{ width: 90 }} disabled={getSchool() !== 'global'}>
              <Option value="">全部</Option>
              {schools.map(item => <Option key={item.id} value={item.school}>{item.name}</Option>)}
            </Select>)
            }
          </FormItem>
          <FormItem label="老师" style={{ marginBottom: 20, marginRight: 40 }}>
            {getFieldDecorator('userid', {
              initialValue: searchQuery.userid || renderUserId() || '',
              onChange: handleChange,
            })(<Select style={{ width: 150 }} disabled={getUserInfo().rolename === 'teacher'}>
              <Option value="">全部</Option>
              {teachers.map(item => <Option key={item.id} value={item.id.toString()}>{item.firstname}</Option>)}
            </Select>)
            }
          </FormItem>
          <FormItem label="开课时间" style={{ marginBottom: 20, marginRight: 50 }}>
            {getFieldDecorator('available', {
              initialValue: renderRangeDate(searchQuery.available, searchQuery.deadline),
              onChange: handleChange,
            })(<RangePicker style={{ width: 200 }} {...rangePickerProps} />)}
          </FormItem>
          <FormItem label="科目" style={{ marginBottom: 20, marginRight: 40 }}>
            {getFieldDecorator('categoryid', {
              initialValue: searchQuery.categoryid || '',
              onChange: handleChange,
            })(<Select style={{ width: 150 }}>
              <Option value="">全部</Option>
              {categorys.map(item => <Option key={item.id} value={item.id.toString()}>{item.name}</Option>)}
            </Select>)
            }
          </FormItem>
          <FormItem label="精品课/VIP课" style={{ marginBottom: 20, marginRight: 40 }}>
            {getFieldDecorator('category_ext', {
              initialValue: searchQuery.category_ext || '',
              onChange: handleChange,
            })(<Select style={{ width: 90 }}>
              <Option value="">全部</Option>
              <Option value="jp">精品课</Option>
              <Option value="vip">VIP课</Option>
            </Select>)
            }
          </FormItem>
          <FormItem style={{ marginBottom: 20, float: 'right', marginRight: 0 }}>
            {addPower && <Link to={'/lesson/create'}><Button size="large" type="ghost"><Icon type="plus-circle-o" />排课</Button></Link>}
          </FormItem>
        </Form>
      </Col>
    </Row>
  )
}

Search.propTypes = {
  form: PropTypes.object.isRequired,
  addPower: PropTypes.bool.isRequired,
  searchQuery: PropTypes.object.isRequired,
  schools: PropTypes.array.isRequired,
  categorys: PropTypes.array.isRequired,
  teachersDic: PropTypes.object.isRequired,
  onSearch: PropTypes.func.isRequired,
}

export default Form.create()(Search)
