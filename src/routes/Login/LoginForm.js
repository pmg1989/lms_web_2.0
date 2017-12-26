import React from 'react'
import PropTypes from 'prop-types'
import { Base64 } from 'js-base64'
import { Button, Form, Input, Checkbox, Icon } from 'antd'
import QueueAnim from 'rc-queue-anim'
import { config, Cookie } from 'utils'
import styles from './LoginForm.less'

const FormItem = Form.Item

const Login = ({
  loading,
  onOk,
  form: {
    getFieldDecorator,
    validateFieldsAndScroll,
  },
}) => {
  function handleOk (e) {
    e.preventDefault()
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      onOk(values)
    })
  }

  return (
    <div className={styles.form}>
      <QueueAnim delay={200} type="top">
        <div className={styles.logo} key="1">
          <img src={config.logoSrc} alt={config.logoSrc} />
          <span>{config.logoText}</span>
        </div>
      </QueueAnim>
      <Form onSubmit={handleOk}>
        <QueueAnim delay={200} type="top">
          <FormItem hasFeedback key="1">
            {getFieldDecorator('username', {
              initialValue: Cookie.get('user_name'),
              rules: [
                {
                  required: true,
                  message: '请填写用户名',
                },
              ],
            })(<Input prefix={<Icon type="user" />} size="large" placeholder="用户名" />)}
          </FormItem>
          <FormItem hasFeedback key="2">
            {getFieldDecorator('password', {
              initialValue: Base64.decode(Cookie.get('user_password') || ''),
              rules: [
                {
                  required: true,
                  message: '请填写密码',
                },
              ],
            })(<Input prefix={<Icon type="lock" />} size="large" type="password" placeholder="密码" />)}
          </FormItem>
          <FormItem key="3">
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(
              <Checkbox>记住密码(一周)</Checkbox>
            )}
            <Button type="primary" htmlType="submit" size="large" loading={loading}>登录</Button>
          </FormItem>
        </QueueAnim>
      </Form>
    </div>
  )
}

Login.propTypes = {
  form: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  onOk: PropTypes.func.isRequired,
}

export default Form.create()(Login)
