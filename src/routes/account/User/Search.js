import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Select } from 'antd'
import SearchGroup from 'components/Search'
import { queryString } from 'utils'

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
    school,
    hasTeacher,
  },
  schools,
  onSearch,
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
    selectOptions: [{ value: 'firstname', name: '真实姓名' }, { value: 'phone2', name: '手机号' }, { value: 'uname', name: '用户名' }],
    selectProps: {
      defaultValue: field || 'firstname',
    },
    onSearch: (value) => {
      validateFields((errors, values) => {
        if (errors) {
          return
        }
        searchValues = value
        let data = {}
        if (values.school) {
          data.school = values.school
        }
        if (values.hasTeacher) {
          data.hasTeacher = values.hasTeacher
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
          <FormItem label="校区" style={{ marginBottom: 20, marginRight: 40 }}>
            {getFieldDecorator('school', {
              initialValue: school || '',
            })(<Select style={{ width: 90 }}>
              <Option value="">全部</Option>
              {schools.map(item => <Option key={item.id} value={item.school}>{item.name}</Option>)}
            </Select>)
            }
          </FormItem>
          <FormItem label="是否已分配老师" style={{ marginBottom: 20, marginRight: 40 }}>
            {getFieldDecorator('hasTeacher', {
              initialValue: hasTeacher || '',
            })(<Select style={{ width: 90 }}>
              <Option value="">全部</Option>
              <Option value="0">未分配</Option>
              <Option value="1">已分配</Option>
            </Select>)
            }
          </FormItem>
          <FormItem style={{ marginBottom: 20, marginRight: 0 }}>
            <SearchGroup {...searchGroupProps} />
          </FormItem>
        </Form>
      </Col>
    </Row>
  )
}

Search.propTypes = {
  form: PropTypes.object.isRequired,
  onSearch: PropTypes.func,
  onAdd: PropTypes.func,
  query: PropTypes.object,
  schools: PropTypes.array.isRequired,
}

export default Form.create({
  onValuesChange () {
    setTimeout(() => {
      searchGroupProps.onSearch(searchValues)
    }, 0)
  },
})(Search)
