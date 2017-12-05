import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Row, Col, Icon, Select } from 'antd'
import { SearchGroup } from 'components'
import { queryString } from 'utils'
import { roleNames, categorys, subjects } from 'utils/dictionary'

const FormItem = Form.Item
const Option = Select.Option
let searchGroupProps = {}
let searchValues = {
  keyword: queryString('keyword'),
  field: queryString('field'),
}

const Search = ({
  query: {
    field,
    keyword,
    rolename,
    category,
    subject,
  },
  addPower,
  onSearch,
  onAdd,
  form: {
    getFieldDecorator,
    validateFields,
  },
}) => {
  searchGroupProps = {
    field,
    keyword,
    size: 'large',
    select: true,
    selectOptions: [{ value: 'username', name: '用户名' }, { value: 'firstname', name: '真实姓名' }, { value: 'phone2', name: '手机号' }],
    selectProps: {
      defaultValue: field || 'username',
    },
    onSearch: (value) => {
      validateFields((errors, values) => {
        if (errors) {
          return
        }
        searchValues = value
        let data = {}
        if (values.rolename) {
          data.rolename = values.rolename
        }
        if (values.category) {
          data.category = values.category
        }
        if (values.subject) {
          data.subject = values.subject
        }
        if (value.keyword) {
          data.keyword = value.keyword
          data.field = value.field
        }
        onSearch(data)
      })
    },
  }

  return (
    <Row gutter={24}>
      <Col>
        <Form layout="inline">
          <FormItem label="角色" style={{ marginBottom: 20, marginRight: 40 }}>
            {getFieldDecorator('rolename', {
              initialValue: rolename || '',
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
              initialValue: category || '',
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
              initialValue: subject || '',
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
  onSearch: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  query: PropTypes.object,
  addPower: PropTypes.bool.isRequired,
}

export default Form.create({
  onValuesChange () {
    setTimeout(() => {
      searchGroupProps.onSearch(searchValues)
    }, 0)
  },
})(Search)
