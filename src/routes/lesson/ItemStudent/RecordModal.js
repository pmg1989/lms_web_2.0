import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Upload, Button, Icon, Row, Col } from 'antd'
import { getModalType } from 'utils/dictionary'
import { uploadRecord, removeUploadRecord } from 'services/lesson/student'

const confirm = Modal.confirm
const FormItem = Form.Item

class UploadRecord extends Component {
  static propTypes = {
    value: PropTypes.object,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
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
      uploading: false,
    }
  }

  handleUpload = () => {
    const { file } = this.state
    this.setState({ uploading: true })

    const onChange = this.props.onChange
    onChange && onChange(file, ({ status, data }) => {
      if (status !== 10000) {
        this.setState({ uploading: false })
      } else {
        this.setState({
          uploading: false,
          file: {
            uid: data.key,
            name: data.name,
            status: 'done',
            url: data.url,
          },
        })
      }
    })
  }

  render () {
    const { uploading } = this.state

    const props = {
      onRemove: (file) => {
        if (!file.lastModified) {
          confirm({
            title: '您确定要删除上传的录音文件吗?',
            onOk: () => {
              removeUploadRecord({ key: this.state.file.uid }).then(() => {
                this.setState({ file: null })
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
      onOk(values)
    })
  }

  const { name, icon } = getModalType(type)
  const modalFormOpts = {
    title: <div><Icon type={icon} /> {name} - 录音信息</div>,
    maskClosable: false,
    visible,
    wrapClassName: 'vertical-center-modal',
    confirmLoading: loading,
    onOk: handleOk,
    onCancel,
  }

  const handleUpload = (file, cb) => {
    uploadRecord({
      lessonid: curItem.lessonid,
      studentid: curItem.id,
      file,
    }).then(res => cb(res))
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
          })(<UploadRecord />)}
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
