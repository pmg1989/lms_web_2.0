import React from 'react'
import PropTypes from 'prop-types'
import { Form, Select, Input, Modal, Icon } from 'antd'
import { getModalType } from 'utils/dictionary'

const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 17,
  },
}

const ModalForm = ({
  modal: { curItem, type, visible },
  loading,
  onOk,
  onCancel,
  form: {
    getFieldDecorator, validateFields,
  },
}) => {
  function handleOk () {
    validateFields((errors, values) => {
      if (errors) {
        return
      }
      values.contractid = curItem.contract.contractid
      values.coursecategory = curItem.contract.categoryid
      onOk(values)
    })
  }

  const { name, icon } = getModalType(type)
  const modalFormOpts = {
    title: <div><Icon type={icon} /> {name} - 设置任课老师</div>,
    maskClosable: false,
    visible,
    width: 600,
    wrapClassName: 'vertical-center-modal',
    confirmLoading: loading,
    onOk: handleOk,
    onCancel,
  }

  let teacherList = []
  if (curItem.teacherList) {
    const categoryIdnumber = curItem.contract && curItem.contract.category_idnumber
    teacherList = curItem.teacherList.filter(item => (
      categoryIdnumber === 'composition' ?
        item.teacher_category === 'profession' :
        categoryIdnumber.split('-')[0].includes(item.teacher_subject)
    ))
  }

  return (
    <Modal {...modalFormOpts}>
      <Form>
        <FormItem label="任课老师" {...formItemLayout}>
          {getFieldDecorator('teacherid', {
            initialValue: (teacherList.find(item => item.teacher_name === curItem.contract.firstname) || {}).id,
            rules: [
              {
                required: true,
                message: '请选择任课老师',
              },
            ],
          })(<Select
            showSearch
            placeholder="请选择任课老师"
            optionFilterProp="children"
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {teacherList.map((item, key) => <Option key={key} value={item.id}>{item.alternatename}</Option>)}
          </Select>)}
        </FormItem>
        <FormItem label="备注信息" hasFeedback {...formItemLayout}>
          {getFieldDecorator('modify_note', {
            initialValue: '',
            rules: [
              {
                required: true,
                message: '请输入备注信息',
              },
            ],
          })(<Input placeholder="请输入备注信息" />)}
        </FormItem>
      </Form>
    </Modal>
  )
}

ModalForm.propTypes = {
  modal: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}

export default Form.create()(ModalForm)
