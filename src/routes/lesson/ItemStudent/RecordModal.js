import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Upload, Button, Icon, Row, Col } from 'antd'
import { getModalType } from 'utils/dictionary'
import { removeUploadRecord } from 'services/lesson/student'

const confirm = Modal.confirm
const FormItem = Form.Item

class UploadRecord extends Component {
  static propTypes = {
    value: PropTypes.object,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    uploading: PropTypes.bool,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    uploading: false,
  }

  constructor (props) {
    super(props)

    const file = this.props.value || {}
    this.state = {
      file: !!file.name.length && {
        uid: file.key,
        name: file.name,
        status: 'init',
        url: file.url,
      },
      removing: false,
    }
  }

  handleUpload = () => {
    const { file } = this.state
    this.setState({ uploading: true })

    const onChange = this.props.onChange
    onChange && onChange(file)
  }

  render () {
    const { uploading } = this.props
    const { removing } = this.state

    const props = {
      onRemove: (file) => {
        if (!file.lastModified) {
          confirm({
            title: '您确定要删除上传的录音文件吗?',
            onOk: () => {
              this.setState({ removing: true })
              removeUploadRecord({ key: this.state.file.uid }).then(() => {
                this.setState({ file: null, removing: false })
              })
            },
          })
        } else {
          this.setState({ file: null })
        }
      },
      beforeUpload: (file) => {
        this.setState({ file })
        return false
      },
      fileList: this.state.file ? [this.state.file] : [],
    }

    return (
      <div>
        <Row>
          <Col span={18}>
            <Upload {...props}>
              <Button><Icon type="upload" /> 请选择录音文件</Button>
            </Upload>
          </Col>
          <Col span={6}>
            <Button
              size="large"
              type="primary"
              onClick={this.handleUpload}
              disabled={!this.state.file || this.state.file.status === 'init'}
              loading={uploading}
            >
              {uploading ? '上传中' : '开始上传'}
            </Button>
          </Col>
        </Row>
        {removing &&
        <Row>
          <Col>录音删除中...</Col>
        </Row>}
      </div>
    )
  }
}

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
  form: {
    getFieldDecorator,
    validateFields,
  },
  onUpload,
  onOk,
  onCancel,
}) => {
  function handleOk () {
    validateFields((errors, values) => {
      if (errors) {
        return
      }
      values.studentid = curItem.id
      values.lessonid = curItem.lessonid
      delete values.file
      onOk(values)
    })
  }

  const { name, icon } = getModalType(type)
  const modalFormOpts = {
    title: <div><Icon type={icon} /> {name} - 录音信息</div>,
    maskClosable: false,
    visible,
    wrapClassName: 'vertical-center-modal',
    confirmLoading: loading.record,
    onOk: handleOk,
    onCancel,
  }

  const handleUpload = (file) => {
    onUpload({
      lessonid: curItem.lessonid,
      studentid: curItem.id,
      file,
    })
  }

  return (
    <Modal {...modalFormOpts}>
      <Form>
        <FormItem label="曲目名称" {...formItemLayout}>
          {getFieldDecorator('song', {
            initialValue: curItem.jl_song.song,
            rules: [
              {
                required: true,
                message: '请输入曲目名称',
              },
            ],
          })(<Input placeholder="请输入曲目名称" />)}
        </FormItem>
        <FormItem label="原唱" {...formItemLayout}>
          {getFieldDecorator('original_singer', {
            initialValue: curItem.jl_song.original_singer,
            rules: [
              {
                required: true,
                message: '请输入原唱',
              },
            ],
          })(<Input placeholder="请输入原唱" />)}
        </FormItem>
        <FormItem label="上传文件" {...formItemLayout}>
          {getFieldDecorator('file', {
            initialValue: curItem.jl_recording,
            onChange: handleUpload,
          })(<UploadRecord uploading={loading.upload} />)}
        </FormItem>
      </Form>
    </Modal>
  )
}

ModalForm.propTypes = {
  modal: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  loading: PropTypes.object.isRequired,
  onUpload: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}

export default Form.create()(ModalForm)
