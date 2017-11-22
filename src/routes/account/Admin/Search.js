import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Row, Col, Icon, Select } from 'antd'
import { SearchGroup } from 'components'

const FormItem = Form.Item
const Option = Select.Option
let searchGroupProps = {}
let searchValues = {}

const Search = ({
  query: {
    field,
    keyword,
    roleName,
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
    selectOptions: [{ value: 'firstname', name: '用户名' }, { value: 'phone2', name: '手机号' }, { value: 'email', name: '邮箱' }],
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
        if (values.roleName) {
          data.roleName = values.roleName
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
            {getFieldDecorator('roleName', {
              initialValue: roleName || '',
            })(<Select style={{ width: 90 }}>
              <Option value="">全部</Option>
              <Option value="admin">管理员</Option>
              <Option value="teacher">老师</Option>
              <Option value="courseCreator">校长</Option>
              <Option value="hr">HR专员</Option>
              <Option value="specialist">课程专家</Option>
            </Select>)
            }
          </FormItem>
          <FormItem label="类别" style={{ marginBottom: 20, marginRight: 40 }}>
            {getFieldDecorator('category', {
              initialValue: category || '',
            })(<Select style={{ width: 90 }}>
              <Option value="">全部</Option>
              <Option value="profession">专业课</Option>
              <Option value="hd">互动课</Option>
              <Option value="jl">交流课</Option>
            </Select>)
            }
          </FormItem>
          <FormItem label="科目" style={{ marginBottom: 20, marginRight: 40 }}>
            {getFieldDecorator('subject', {
              initialValue: subject || '',
            })(<Select style={{ width: 90 }}>
              <Option value="">全部</Option>
              <Option value="vocal">声乐</Option>
              <Option value="theory">乐理</Option>
              <Option value="piano">键盘</Option>
              <Option value="guitar">吉他</Option>
              <Option value="eguitar">电吉他</Option>
              <Option value="composition">作曲</Option>
              <Option value="record">录音</Option>
              <Option value="rhythm">节奏</Option>
              <Option value="yoga">瑜伽</Option>
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
