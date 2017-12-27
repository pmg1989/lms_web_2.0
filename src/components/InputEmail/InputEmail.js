import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { AutoComplete, Input } from 'antd'

class InputEmail extends Component {
  static propTypes = {
    value: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
  }

  state = {
    value: '',
    dataSource: [],
  }

  componentWillReceiveProps (nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const value = nextProps.value
      let dataSource
      if (!value || value.indexOf('@') >= 0) {
        dataSource = []
      } else {
        dataSource = ['newband.com', '163.com', 'qq.com'].map(domain => `${value}@${domain}`)
      }
      this.setState({ value, dataSource })
    }
  }

  handleChange = (value) => {
    if (!('value' in this.props)) {
      this.setState({ value })
    }
    const onChange = this.props.onChange
    if (onChange) {
      onChange(value)
    }
  }

  render () {
    const { placeholder, disabled } = this.props
    const { value, dataSource } = this.state

    return (
      <AutoComplete
        dataSource={dataSource}
        onChange={this.handleChange}
        placeholder={placeholder || '请输入邮箱'}
        value={value}
        disabled={disabled}
      >
        <Input type="email" />
      </AutoComplete>
    )
  }
}

export default InputEmail
