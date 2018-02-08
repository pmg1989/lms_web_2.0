import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, InputNumber, Select, Spin, Button, Row, Col, Checkbox, DatePicker, Tag } from 'antd'
import moment from 'moment'
import { getSchool, getUserInfo } from 'utils'
import { timeList } from 'utils/dictionary'
import styles from './ItemForm.less'

const FormItem = Form.Item
const Option = Select.Option

const now = Date.now()

const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 17,
  },
}

class ItemForm extends Component {
  static propTypes = {
    addPower: PropTypes.bool.isRequired,
    lessonItem: PropTypes.object.isRequired,
    commonModel: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    queryStudentsLoading: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    onGoBack: PropTypes.func.isRequired,
    onQueryStudentList: PropTypes.func.isRequired,
    onResetStudents: PropTypes.func.isRequired,
  }

  state = {
    schoolId: getUserInfo().school_id,
    showStudentForm: true,
    timeStarts: timeList,
    timeEnds: timeList,
    teachers: [],
    fetching: false,
    errorMsg: '请先完善课程信息！',
  }

  componentWillReceiveProps (nextProps) {
    const { lessonItem: { studentList }, commonModel: { teachers2Dic } } = nextProps
    if (!this.state.teachers.length && Object.keys(teachers2Dic).length) {
      const teachersState = teachers2Dic[this.state.schoolId] || []
      teachersState.length && this.setState({ teachers: teachersState })
    }
    if (this.props.queryStudentsLoading && !nextProps.queryStudentsLoading && !studentList.length) {
      this.setState({ fetching: false, errorMsg: '没有可匹配的学员列表！' })
    }
  }

  disabledDate = (current) => {
    const weekdays = this.props.form.getFieldValue('openweekday')
    if (current && weekdays) {
      const curTimeSpan = current.valueOf()
      const weekday = current.isoWeekday() % 7
      return curTimeSpan < now || !weekdays.includes(weekday.toString())
    }
    return true
  }

  changeStudentForm = (idnumber) => {
    this.setState({ showStudentForm: !idnumber.includes('-vip-') })
  }

  handleSchoolChange = (schoolId) => {
    this.setState({ schoolId })
    const { form: { setFieldsValue, getFieldValue }, lessonItem: { courseCategorys }, commonModel: { teachers2Dic } } = this.props
    const categoryid = getFieldValue('categoryid')
    const courseCategory = courseCategorys.find(cur => cur.id === categoryid)
    const teachers = teachers2Dic[schoolId] || []
    this.setState({ teachers: teachers.filter(cur => courseCategory && courseCategory.idnumber.includes(cur.teacher_subject)) })
    setFieldsValue({ teacherid: undefined, classroomid: undefined })
  }

  handleCategoryChange = (categoryid) => {
    const { lessonItem: { courseCategorys }, commonModel: { teachers2Dic }, form: { getFieldValue, setFieldsValue } } = this.props
    const schoolId = getFieldValue('school_id')
    const courseCategory = courseCategorys.find(cur => cur.id === categoryid)
    const teachers = teachers2Dic[schoolId] || []
    this.setState({ teachers: teachers.filter(cur => courseCategory && courseCategory.idnumber.includes(cur.teacher_subject)) })

    const oldCategoryid = getFieldValue('categoryid')
    const oldCourseCategory = courseCategorys.find(cur => cur.id === oldCategoryid)
    if (oldCourseCategory && oldCourseCategory.idnumber.split('-')[0] !== courseCategory.idnumber.split('-')[0]) {
      setFieldsValue({ teacherid: undefined })
    }

    this.changeStudentForm(courseCategory.idnumber)
  }

  handleWeekdayChange = (weekdays) => {
    const { form: { getFieldValue, setFieldsValue } } = this.props
    const startdate = getFieldValue('startdate')
    if (startdate && !weekdays.includes((startdate.isoWeekday() % 7).toString())) {
      setFieldsValue({ startdate: undefined })
    }
  }

  handleTimeStartsChange = (available) => {
    const index = timeList.findIndex(cur => cur === available)
    this.setState({ timeEnds: timeList.slice(index + 1) })

    const deadline = this.props.form.getFieldValue('deadline')
    if (deadline) {
      const deadlineIndex = timeList.findIndex(cur => cur === deadline)
      if (deadlineIndex <= index) {
        this.props.form.setFieldsValue({ deadline: timeList[index + 1] })
      }
    }
  }

  handleMultipleChange = () => {
    this.setState({ fetching: false })
  }

  queryStudentList = (phone2) => {
    const { form: { getFieldsValue }, lessonItem: { studentList }, onQueryStudentList, onResetStudents } = this.props
    const params = getFieldsValue(['categoryid', 'teacherid', 'classroomid', 'openweekday', 'numsections', 'startdate', 'available', 'deadline'])

    if (params.categoryid && params.teacherid && params.classroomid && params.openweekday && params.openweekday.length && params.numsections && params.startdate && params.available && params.deadline) {
      if (phone2.length < 11) {
        studentList.length && onResetStudents()
        this.setState({ fetching: false, errorMsg: '请继续输入手机号码！' })
        return false
      }
      if (!(/^1(3|4|5|7|8)\d{9}$/.test(phone2))) {
        this.setState({ fetching: false, errorMsg: '手机号码格式有误！' })
        return false
      }

      this.setState({ fetching: true })
      const stateDate = params.startdate
      params.startdate = stateDate.startOf('day').format('X')
      params.openweekday = params.openweekday.sort().join(',')
      params.available = moment(`${stateDate.format('YYYY-MM-DD')} ${params.available}`).format('X')
      params.deadline = moment(`${stateDate.format('YYYY-MM-DD')} ${params.deadline}`).format('X')
      onQueryStudentList(params, phone2)
    } else {
      console.log('error')
      this.setState({ fetching: false, errorMsg: '请先完善表单数据！' })
    }
    return true
  }

  handleAdd = (e) => {
    const { form: { validateFieldsAndScroll }, onSubmit } = this.props
    e.preventDefault()
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        const stateDate = values.startdate
        values.startdate = stateDate.startOf('day').format('X')
        values.openweekday = values.openweekday.sort().join(',')
        values.available = moment(`${stateDate.format('YYYY-MM-DD')} ${values.available}`).format('X')
        values.deadline = moment(`${stateDate.format('YYYY-MM-DD')} ${values.deadline}`).format('X')
        if (values.studentid && values.studentid.length) {
          values.studentid = values.studentid.map(item => item.key).join(',')
        } else {
          delete values.studentid
        }
        delete values.studentid2
        delete values.school_id

        onSubmit(values)
      }
    })
  }


  render () {
    const {
      lessonItem: { courseCategorys, studentList },
      commonModel: { schools, classroomsDic },
      addPower,
      loading, onGoBack,
      form: { getFieldDecorator },
    } = this.props
    const { schoolId, teachers, timeStarts, timeEnds, fetching, errorMsg, showStudentForm } = this.state

    const classrooms = classroomsDic[schoolId] || []

    const courseCategorysProps = {
      showSearch: true,
      placeholder: '--请选择课程类型--',
      optionFilterProp: 'children',
      filterOption: (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0,
    }

    return (
      <Spin spinning={loading} size="large">
        <Form className={styles.form_box}>
          <FormItem label="课程类型" hasFeedback {...formItemLayout} extra="支持输入关键字筛选">
            {getFieldDecorator('categoryid', {
              onChange: this.handleCategoryChange,
              rules: [
                {
                  required: true,
                  message: '请输入课程类型',
                },
              ],
            })(<Select {...courseCategorysProps}>
              {courseCategorys.map(courseCategory => <Option key={courseCategory.id} value={courseCategory.id.toString()}>{courseCategory.description}</Option>)}
            </Select>)}
          </FormItem>
          <FormItem label="校区" hasFeedback {...formItemLayout}>
            {getFieldDecorator('school_id', {
              initialValue: getUserInfo().school_id.toString(),
              onChange: this.handleSchoolChange,
            })(<Select disabled={getSchool() !== 'global'} placeholder="--请选择校区--">
              {schools.map(school => <Option key={school.id} value={school.id.toString()}>{school.name}</Option>)}
            </Select>)
            }
          </FormItem>
          <FormItem label="老师" hasFeedback {...formItemLayout}>
            {getFieldDecorator('teacherid', {
              rules: [
                {
                  required: true,
                  message: '请选择老师',
                },
              ],
            })(<Select placeholder="--请选择老师--">
              {teachers.map(teacher => <Option key={teacher.id} value={teacher.id.toString()}>{teacher.alternatename}</Option>)}
            </Select>)
            }
          </FormItem>
          <FormItem label="教室" hasFeedback {...formItemLayout}>
            {getFieldDecorator('classroomid', {
              rules: [
                {
                  required: true,
                  message: '请选择教室',
                },
              ],
            })(<Select placeholder="--请选择教室--">
              {classrooms.map(classroom => <Option key={classroom.id} value={classroom.id.toString()}>{classroom.name}</Option>)}
            </Select>)
            }
          </FormItem>
          <FormItem label="每周" hasFeedback {...formItemLayout}>
            {getFieldDecorator('openweekday', {
              onChange: this.handleWeekdayChange,
              rules: [
                {
                  required: true,
                  message: '请选择每周工作日',
                },
              ],
            })(<Checkbox.Group placeholder="--请选择每周工作日--">
              <Row>
                <Col span={6}><Checkbox value="1">周一</Checkbox></Col>
                <Col span={6}><Checkbox value="2">周二</Checkbox></Col>
                <Col span={6}><Checkbox value="3">周三</Checkbox></Col>
                <Col span={6}><Checkbox value="4">周四</Checkbox></Col>
                <Col span={6}><Checkbox value="5">周五</Checkbox></Col>
                <Col span={6}><Checkbox value="6">周六</Checkbox></Col>
                <Col span={6}><Checkbox value="0">周日</Checkbox></Col>
              </Row>
            </Checkbox.Group>)}
          </FormItem>
          <FormItem label="持续周数" hasFeedback {...formItemLayout}>
            {getFieldDecorator('numsections', {
              initialValue: 4,
              rules: [
                {
                  required: true,
                  message: '请输入持续周数',
                },
              ],
            })(<InputNumber min={1} placeholder="请输入持续周数" />)
            }
          </FormItem>
          <FormItem label="上课日期" hasFeedback {...formItemLayout}>
            {getFieldDecorator('startdate', {
              rules: [
                {
                  required: true,
                  message: '请选择上课日期',
                },
              ],
            })(<DatePicker
              className={styles.date_picker}
              placeholder="请选择上课日期"
              disabledDate={this.disabledDate}
            />)
            }
          </FormItem>
          <FormItem label="上课时间" hasFeedback {...formItemLayout}>
            <Col span={11}>
              <FormItem>
                {getFieldDecorator('available', {
                  onChange: this.handleTimeStartsChange,
                  rules: [
                    {
                      required: true,
                      message: '请选择上课时间',
                    },
                  ],
                })(<Select className={styles.date_picker} placeholder="--请选择上课时间--">
                  {timeStarts.map(time => <Option key={time} value={time}>{time}</Option>)}
                </Select>)
                }
              </FormItem>
            </Col>
            <Col span={2}>
              <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>--</span>
            </Col>
            <Col span={11}>
              <FormItem>
                {getFieldDecorator('deadline', {
                  rules: [
                    {
                      required: true,
                      message: '请选择下课时间',
                    },
                  ],
                })(<Select className={styles.date_picker} placeholder="--请选择下课时间--">
                  {timeEnds.map(time => <Option key={time} value={time}>{time}</Option>)}
                </Select>)
                }
              </FormItem>
            </Col>
          </FormItem>
          {showStudentForm &&
            <FormItem label="添加学员" hasFeedback {...formItemLayout} >
              {getFieldDecorator('studentid', {
              })(<Select
                mode="multiple"
                labelInValue
                placeholder="请逐个输入学员手机号码进行验证"
                notFoundContent={fetching ? <Spin size="small" /> : <Tag color="red">{errorMsg}</Tag>}
                filterOption={false}
                onChange={this.handleMultipleChange}
                onSearch={this.queryStudentList}
              >
                {studentList.map(d => <Option key={d.id} value={d.id}>{d.firstname}</Option>)}
              </Select>)}
            </FormItem>
          }
          <FormItem wrapperCol={{ span: 17, offset: 4 }}>
            {addPower &&
              <Button className={styles.btn} onClick={this.handleAdd} type="primary" htmlType="submit" size="large">创建</Button>
            }
            <Button className={styles.btn} type="default" onClick={onGoBack} size="large">返回</Button>
          </FormItem>
        </Form>
      </Spin>
    )
  }
}

export default Form.create()(ItemForm)
