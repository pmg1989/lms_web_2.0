import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Row, Col, Icon, Select } from 'antd'
import { SearchGroup } from 'components'
import { getSchool } from 'utils'
import { roleNames, categorys, subjects } from 'utils/dictionary'

const FormItem = Form.Item
const Option = Select.Option
let searchGroupProps = {}
let searchValues = {}

const Search = ({
  addPower,
  schools,
  onSearch,
  onAdd,
  form: {
    getFieldDecorator,
    validateFields,
  },
}) => {
  searchGroupProps = {
    size: 'large',
    select: true,
    selectOptions: [{ value: 'username', name: '用户名' }, { value: 'firstname', name: '真实姓名' }, { value: 'phone2', name: '手机号' }],
    selectProps: {
      defaultValue: 'username',
    },
    onSearch: (value) => {
      validateFields((errors, values) => {
        if (errors) {
          return
        }
        searchValues = value
        values.keyword = value.keyword
        values.field = value.field
        onSearch(values)
      })
    },
  }

  return (
    <Row gutter={24}>
      <Col>
        <Form layout="inline">
          <FormItem label="校区" style={{ marginBottom: 20, marginRight: 40 }}>
            {getFieldDecorator('school', {
              initialValue: getSchool(),
            })(<Select style={{ width: 90 }} disabled={getSchool() !== 'global'}>
              <Option value="">全部</Option>
              {schools.map(item => <Option key={item.id} value={item.school}>{item.name}</Option>)}
            </Select>)
            }
          </FormItem>
          <FormItem label="角色" style={{ marginBottom: 20, marginRight: 40 }}>
            {getFieldDecorator('rolename', {
              initialValue: '',
            })(<Select style={{ width: 90 }}>
              <Option value="">全部</Option>
              {Object.entries(roleNames).map(([key, value]) => {
                return <Option key={key} value={key}>{value}</Option>
              })}
            </Select>)
            }
          </FormItem>
          <FormItem label="类别" style={{ marginBottom: 20, marginRight: 40 }}>
            {getFieldDecorator('category', {
              initialValue: '',
            })(<Select style={{ width: 90 }}>
              <Option value="">全部</Option>
              {Object.entries(categorys).map(([key, value]) => {
                return <Option key={key} value={key}>{value}</Option>
              })}
            </Select>)
            }
          </FormItem>
          <FormItem label="科目" style={{ marginBottom: 20, marginRight: 40 }}>
            {getFieldDecorator('subject', {
              initialValue: '',
            })(<Select style={{ width: 90 }}>
              <Option value="">全部</Option>
              {Object.entries(subjects).map(([key, value]) => {
                return <Option key={key} value={key}>{value}</Option>
              })}
            </Select>)
            }
          </FormItem>
          <FormItem style={{ marginBottom: 20, marginRight: 0 }}>
            <SearchGroup {...searchGroupProps} />
          </FormItem>
          <FormItem style={{ marginBottom: 20, float: 'right', marginRight: 0 }}>
            {addPower && <Button size="large" type="ghost" onClick={onAdd}><Icon type="plus-circle-o" />添加</Button>}
          </FormItem>
        </Form>
      </Col>
    </Row>
  )
}

Search.propTypes = {
  form: PropTypes.object.isRequired,
  schools: PropTypes.array.isRequired,
  onSearch: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  addPower: PropTypes.bool.isRequired,
}

export default Form.create({
  onValuesChange () {
    setTimeout(() => {
      searchGroupProps.onSearch(searchValues)
    }, 0)
  },
})(Search)
