import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col } from 'antd'
import SearchGroup from 'components/Search'

const Search = ({
  field,
  keyword,
  onSearch,
}) => {
  const searchGroupProps = {
    field,
    keyword,
    size: 'large',
    select: true,
    selectOptions: [{ value: 'name', name: '用户名' }, { value: 'mobile', name: '手机号' }, { value: 'email', name: '邮箱' }],
    selectProps: {
      defaultValue: field || 'name',
    },
    onSearch: (value) => {
      onSearch(value)
    },
  }

  return (
    <Row gutter={24}>
      <Col lg={8} md={12} sm={16} xs={24} style={{ marginBottom: 16 }}>
        <SearchGroup {...searchGroupProps} />
      </Col>
    </Row>
  )
}

Search.propTypes = {
  form: PropTypes.object.isRequired,
  onSearch: PropTypes.func,
  onAdd: PropTypes.func,
  field: PropTypes.string,
  keyword: PropTypes.string,
}

export default Form.create()(Search)
