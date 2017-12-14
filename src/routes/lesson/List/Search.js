import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'dva/router'
import { Form, Row, Col, Button, Select, Icon } from 'antd'
import { getSchool, getUserInfo } from 'utils'

const FormItem = Form.Item
const Option = Select.Option

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
      onSearch(getFieldsValue())
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

  return (
    <Row gutter={24}>
      <Col>
        <Form layout="inline">
          <FormItem label="校区" style={{ marginBottom: 20, marginRight: 40 }}>
            {getFieldDecorator('school', {
              initialValue: getSchool(),
              onChange: handleSchoolChange,
            })(<Select style={{ width: 90 }} disabled={getSchool() !== 'global'}>
              <Option value="">全部</Option>
              {schools.map(item => <Option key={item.id} value={item.school}>{item.name}</Option>)}
            </Select>)
            }
          </FormItem>
          <FormItem label="老师" style={{ marginBottom: 20, marginRight: 40 }}>
            {getFieldDecorator('userid', {
              initialValue: renderUserId() || '',
              onChange: handleChange,
            })(<Select style={{ width: 150 }} disabled={getUserInfo().rolename === 'teacher'}>
              <Option value="">全部</Option>
              {teachers.map(item => <Option key={item.id} value={item.id.toString()}>{item.firstname}</Option>)}
            </Select>)
            }
          </FormItem>
          <FormItem label="科目" style={{ marginBottom: 20, marginRight: 40 }}>
            {getFieldDecorator('categoryid', {
              initialValue: '',
              onChange: handleChange,
            })(<Select style={{ width: 150 }}>
              <Option value="">全部</Option>
              {categorys.map(item => <Option key={item.id} value={item.id.toString()}>{item.name}</Option>)}
            </Select>)
            }
          </FormItem>
          <FormItem label="精品课/VIP课" style={{ marginBottom: 20, marginRight: 40 }}>
            {getFieldDecorator('category_ext', {
              initialValue: '',
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
