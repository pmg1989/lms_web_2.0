import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Select } from 'antd'
import classnames from 'classnames'
import { getSchool, getUserInfo } from 'utils'
import styles from './Search.less'

const FormItem = Form.Item
const Option = Select.Option

class Search extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    searchQuery: PropTypes.object.isRequired,
    schools: PropTypes.array.isRequired,
    categorys: PropTypes.array.isRequired,
    teachersDic: PropTypes.object.isRequired,
    onSearch: PropTypes.func.isRequired,
  }

  state = {
    teachers: this.props.teachersDic[this.props.searchQuery.school] || [],
  }

  componentWillReceiveProps () {
    if (!this.state.teachers.length && Object.keys(this.props.teachersDic).length) {
      const teachersState = this.props.teachersDic[this.props.searchQuery.school] || []
      teachersState.length && this.setState({ teachers: teachersState })
    }
  }

  handleChange = () => {
    const { onSearch, form: { getFieldsValue } } = this.props
    setTimeout(() => {
      onSearch(getFieldsValue())
    }, 0)
  }

  handleSchoolChange = (school) => {
    const { form: { setFieldsValue }, teachersDic } = this.props
    setFieldsValue({ userid: '' })
    this.setState({ teachers: teachersDic[school] || [] })
    this.handleChange()
  }

  render () {
    const {
      searchQuery,
      schools,
      categorys,
      form: {
        getFieldDecorator,
      },
    } = this.props

    const { teachers } = this.state

    const renderUserId = () => {
      return (teachers.find(item => item.username === getUserInfo().uname) || {}).id
    }

    return (
      <Row gutter={24}>
        <Col>
          <Form layout="inline">
            <FormItem label="校区" style={{ marginBottom: 20, marginRight: 40 }}>
              {getFieldDecorator('school', {
                initialValue: searchQuery.school || getSchool(),
                onChange: this.handleSchoolChange,
              })(<Select style={{ width: 90 }} disabled={getSchool() !== 'global'}>
                {/* <Option value="">全部</Option> */}
                {schools.map(item => <Option key={item.id} value={item.school}>{item.name}</Option>)}
              </Select>)
              }
            </FormItem>
            <FormItem label="老师" style={{ marginBottom: 20, marginRight: 40 }}>
              {getFieldDecorator('userid', {
                // initialValue: searchQuery.userid || renderUserId() || '',
                initialValue: renderUserId() || '',
                onChange: this.handleChange,
              })(<Select style={{ width: 150 }} disabled={getUserInfo().rolename === 'teacher'}>
                <Option value="">全部</Option>
                {teachers.map(item => <Option key={item.id} value={item.id.toString()}>{item.alternatename}</Option>)}
              </Select>)
              }
            </FormItem>
            <FormItem label="科目" style={{ marginBottom: 20, marginRight: 40 }}>
              {getFieldDecorator('categoryid', {
                initialValue: searchQuery.categoryid || '',
                onChange: this.handleChange,
              })(<Select className={styles.subject_box} style={{ width: 150 }}>
                <Option value=""><div className={classnames(styles.item, styles.all)}>全部</div></Option>
                {categorys.map(item => <Option key={item.id} value={item.id.toString()}><div className={classnames(styles.item, styles[item.idnumber])}>{item.name}</div></Option>)}
              </Select>)
              }
            </FormItem>
            <FormItem label="精品课/VIP课" style={{ marginBottom: 20, marginRight: 40 }}>
              {getFieldDecorator('category_ext', {
                initialValue: searchQuery.category_ext || '',
                onChange: this.handleChange,
              })(<Select style={{ width: 90 }}>
                <Option value="">全部</Option>
                <Option value="jp">精品课</Option>
                <Option value="vip">VIP课</Option>
              </Select>)
              }
            </FormItem>
          </Form>
        </Col>
      </Row>
    )
  }
}

export default Form.create()(Search)
