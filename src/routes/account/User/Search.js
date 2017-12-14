import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Select } from 'antd'
import SearchGroup from 'components/Search'
import { getSchool } from 'utils'

const FormItem = Form.Item
const Option = Select.Option

const Search = ({
  schools,
  onSearch,
  form: {
    getFieldDecorator,
    getFieldsValue,
  },
}) => {
  const searchGroupProps = {
    size: 'large',
    select: true,
    selectOptions: [{ value: 'firstname', name: '真实姓名' }, { value: 'phone2', name: '手机号' }, { value: 'uname', name: '用户名' }],
    selectProps: {
      defaultValue: 'firstname',
    },
    onSearch: (value) => {
      const fieldsValue = getFieldsValue()
      fieldsValue.keyword = value.keyword
      fieldsValue.field = value.field
      onSearch(fieldsValue)
    },
  }

  const handleChange = () => {
    setTimeout(() => {
      onSearch({ ...getFieldsValue(), isPostBack: false })
    }, 0)
  }

  const handleSchoolChange = () => {
    setTimeout(() => {
      onSearch({ ...getFieldsValue(), isPostBack: true })
    }, 0)
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
          <FormItem label="是否已分配老师" style={{ marginBottom: 20, marginRight: 40 }}>
            {getFieldDecorator('hasTeacher', {
              initialValue: '',
              onChange: handleChange,
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
  schools: PropTypes.array.isRequired,
}

export default Form.create()(Search)
