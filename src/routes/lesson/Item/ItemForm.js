import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Input, Select, Spin, Button, Row, Col, DatePicker, Tag } from 'antd'
import moment from 'moment'
import { getSchool, getUserInfo } from 'utils'
import { timeList } from 'utils/dictionary'
import ItemStudent from '../ItemStudent'
import styles from './ItemForm.less'

const FormItem = Form.Item
const Option = Select.Option
const confirm = Modal.confirm
const warning = Modal.warning

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
    updatePower: PropTypes.bool.isRequired,
    addDaiTeacherPower: PropTypes.bool.isRequired,
    addDeleteStudentPower: PropTypes.bool.isRequired,
    otherStudentPower: PropTypes.bool.isRequired,
    lessonItem: PropTypes.object.isRequired,
    commonModel: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    queryStudents2Loading: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    onGoBack: PropTypes.func.isRequired,
    onChangeDaiTeacher: PropTypes.func.isRequired,
    onQueryStudentList2: PropTypes.func.isRequired,
    onResetStudents: PropTypes.func.isRequired,
    onAddStudent: PropTypes.func.isRequired,
  }

  state = {
    schoolId: getUserInfo().school_id,
    timeStarts: timeList,
    timeEnds: timeList,
    teachers: [],
    fetching: false,
    errorMsg: '请先完善课程信息！',
    addDisabled: true,
    studentid: null,
  }

  componentWillReceiveProps (nextProps) {
    const { lessonItem } = this.props
    const { lessonItem: { item, studentList }, commonModel: { teachers2Dic } } = nextProps
    if (!lessonItem.item.category_summary && item.category_summary) {
      this.handleSchoolChange(item.school_id || this.state.schoolId, false)
    }
    if (!this.state.teachers.length && Object.keys(teachers2Dic).length) {
      const teachersState = teachers2Dic[item.school_id || this.state.schoolId] || []
      teachersState.length && this.setState({ teachers: teachersState })
    }
    if (this.props.queryStudents2Loading && !nextProps.queryStudents2Loading && !studentList.length) {
      this.setState({ fetching: false, errorMsg: '没有可匹配的学员列表！' })
    }
  }

  TeacherDaiFormItem = ({ teacherId, disabled }) => {
    const { form: { getFieldDecorator, getFieldValue, setFieldsValue }, lessonItem: { item }, addDaiTeacherPower, onChangeDaiTeacher } = this.props
    const { teachers } = this.state
    const teacherDaiId = teachers.length && item.teacher_substitute && teachers.find(cur => cur.firstname === item.teacher_substitute).id

    const handleDaiTeacherChange = (teacherid) => {
      const params = {
        lessonid: item.id,
        userid: teacherid,
        rolename: 'substitute-teacher',
      }
      onChangeDaiTeacher({ params, type: 'change' })
    }

    const handleDeleteDaiTeacher = () => {
      const curTeacherDaiId = getFieldValue('teacher_substitute')
      if (!curTeacherDaiId) {
        warning({ title: '操作警告', content: '没有代课老师，无法删除！' })
        return false
      }
      const params = {
        lessonid: item.id,
        userid: curTeacherDaiId,
        rolename: 'substitute-teacher',
      }
      confirm({
        title: '您确定要删除代课老师吗?',
        onOk () {
          onChangeDaiTeacher({ params, type: 'delete' })
          setFieldsValue({ teacher_substitute: undefined })
        },
      })
      return true
    }

    return (
      <FormItem label="代课老师" hasFeedbac {...formItemLayout} extra="操作代课老师下拉框即可快速修改代课老师啦">
        <Row gutter={24}>
          <Col span={16}>
            {getFieldDecorator('teacher_substitute', {
              initialValue: teacherDaiId || undefined,
              onChange: handleDaiTeacherChange,
            })(<Select size="large" disabled={disabled || !addDaiTeacherPower} placeholder="--请选择添加代课老师--">
              {teachers.filter(cur => cur.id !== teacherId).map(teacher => <Option key={teacher.id} value={teacher.id.toString()}>{teacher.alternatename}</Option>)}
            </Select>)
            }
          </Col>
          <Col span={8} className={styles.text_right}>
            <Button size="large" type="danger" onClick={handleDeleteDaiTeacher} disabled={disabled || !addDaiTeacherPower} icon="close-circle-o">删除代课老师</Button>
          </Col>
        </Row>
      </FormItem>
    )
  }

  disabledDate = (current) => {
    const { lessonItem: { type } } = this.props
    if (type === 'update') {
      return false
    }
    const weekdays = this.props.form.getFieldValue('openweekday')
    if (current && weekdays) {
      const curTimeSpan = current.valueOf()
      const weekday = current.isoWeekday() % 7
      return curTimeSpan < now || !weekdays.includes(weekday.toString())
    }
    return true
  }

  handleSchoolChange = (schoolId, needSetValue = true) => {
    this.setState({ schoolId })
    if (needSetValue) {
      const { form: { setFieldsValue, getFieldValue }, lessonItem: { courseCategorys }, commonModel: { teachers2Dic } } = this.props
      const categoryid = getFieldValue('categoryid')
      const courseCategory = courseCategorys.find(cur => cur.id === categoryid)
      const teachers = teachers2Dic[schoolId] || []
      this.setState({ teachers: teachers.filter(cur => courseCategory && courseCategory.idnumber.includes(cur.teacher_subject)) })
      setFieldsValue({ teacherid: undefined, classroomid: undefined })
    }
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

  queryStudentList2 = (phone2) => {
    const { teachers } = this.state
    const { form: { getFieldsValue }, lessonItem: { item, studentList }, onQueryStudentList2, onResetStudents } = this.props
    const params = getFieldsValue(['classroomid', 'startdate', 'available'])
    params.categoryid = item.categoryid
    params.teacherid = teachers.find(cur => cur.firstname === item.teacher).id
    if (params.categoryid && params.teacherid && params.classroomid && params.startdate && params.available) {
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
      params.available = moment(`${params.startdate.format('YYYY-MM-DD')} ${params.available}`).format('X')
      delete params.startdate
      onQueryStudentList2(params, phone2)
    } else {
      console.log('error')
      this.setState({ fetching: false, errorMsg: '请先完善表单数据！' })
    }
    return true
  }

  handleSelectStudent = (labelName) => {
    const { lessonItem: { studentList } } = this.props
    const [firstname, phone2] = labelName.split('-')
    const student = studentList.find(cur => (cur.firstname === firstname && cur.phone2 === phone2))
    this.setState({ addDisabled: false, studentid: student.id })
  }

  handleAddStudent = () => {
    const { lessonItem: { item }, onAddStudent } = this.props
    this.setState({ addDisabled: true, studentid: null })
    onAddStudent({ lessonid: item.id, userid: this.state.studentid })
  }

  handleUpdate = (e) => {
    const { form: { validateFieldsAndScroll }, lessonItem: { item }, onSubmit } = this.props
    e.preventDefault()
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        const stateDate = values.startdate
        const data = {
          available: moment(`${stateDate.format('YYYY-MM-DD')} ${values.available}`).format('X'),
          deadline: moment(`${stateDate.format('YYYY-MM-DD')} ${values.deadline}`).format('X'),
          classroomid: values.classroomid,
          lessonid: item.id,
        }
        onSubmit(data)
      }
    })
  }

  render () {
    const {
      lessonItem: { type, item, studentList },
      commonModel: { schools, classroomsDic },
      updatePower, addDeleteStudentPower, otherStudentPower,
      loading, onGoBack,
      form: { getFieldDecorator },
    } = this.props
    const { schoolId, teachers, timeStarts, timeEnds, fetching, errorMsg, addDisabled } = this.state

    const disabled = type === 'detail'
    const disabledEdit = type === 'update'
    const classrooms = classroomsDic[schoolId] || []

    const teacherId = teachers.length && item.teacher && teachers.find(cur => cur.firstname === item.teacher).id

    return (
      <Spin spinning={loading} size="large">
        <Form className={styles.form_box}>
          <FormItem label="课程类型" hasFeedback {...formItemLayout}>
            {getFieldDecorator('category_summary', {
              initialValue: item.category_summary,
            })(<Input disabled={disabled || disabledEdit} placeholder="请输入课程名称" />)}
          </FormItem>
          <FormItem label="课程编号" hasFeedbac {...formItemLayout}>
            {getFieldDecorator('course_idnumber', {
              initialValue: item.course_idnumber,
            })(<Input disabled={disabled || disabledEdit} placeholder="请输入课程编号" />)}
          </FormItem>
          <FormItem label="校区" hasFeedback {...formItemLayout}>
            {getFieldDecorator('school_id', {
              initialValue: (item.school_id && item.school_id.toString()) || getUserInfo().school_id.toString(),
              onChange: this.handleSchoolChange,
            })(<Select disabled={disabled || disabledEdit || getSchool() !== 'global'} placeholder="--请选择校区--">
              {schools.map(school => <Option key={school.id} value={school.id.toString()}>{school.name}</Option>)}
            </Select>)
            }
          </FormItem>
          <FormItem label="老师" hasFeedback {...formItemLayout}>
            {getFieldDecorator('teacher', {
              initialValue: item.teacher,
            })(<Input disabled={disabled || disabledEdit} placeholder="请输入老师名称" />)
            }
          </FormItem>
          <this.TeacherDaiFormItem teacherId={teacherId} disabled={disabled} />
          <FormItem label="教室" hasFeedback {...formItemLayout}>
            {getFieldDecorator('classroomid', {
              initialValue: item.classroomid && item.classroomid.toString(),
              rules: [
                {
                  required: true,
                  message: '请选择教室',
                },
              ],
            })(<Select disabled={disabled || !updatePower} placeholder="--请选择教室--">
              {classrooms.map(classroom => <Option key={classroom.id} value={classroom.id.toString()}>{classroom.name}</Option>)}
            </Select>)
            }
          </FormItem>
          <FormItem label="上课日期" hasFeedback {...formItemLayout}>
            {getFieldDecorator('startdate', {
              initialValue: item.available && moment.unix(item.available),
              rules: [
                {
                  required: true,
                  message: '请选择上课日期',
                },
              ],
            })(<DatePicker disabled={disabled || !updatePower}
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
                  initialValue: item.deadline && moment.unix(item.available).format('HH:mm'),
                  onChange: this.handleTimeStartsChange,
                  rules: [
                    {
                      required: true,
                      message: '请选择上课时间',
                    },
                  ],
                })(<Select className={styles.date_picker} disabled={disabled || !updatePower} placeholder="--请选择上课时间--">
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
                  initialValue: item.deadline && moment.unix(item.deadline).format('HH:mm'),
                  rules: [
                    {
                      required: true,
                      message: '请选择下课时间',
                    },
                  ],
                })(<Select className={styles.date_picker} disabled={disabled || !updatePower} placeholder="--请选择下课时间--">
                  {timeEnds.map(time => <Option key={time} value={time}>{time}</Option>)}
                </Select>)
                }
              </FormItem>
            </Col>
          </FormItem>
          <FormItem label="添加学员" {...formItemLayout}>
            {getFieldDecorator('studentInfo', {
            })(type === 'update' && addDeleteStudentPower ?
              <Row style={{ marginBottom: '24px' }}>
                <Col span={16}>
                  <Select
                    size="large"
                    disabled={disabled}
                    mode="combobox"
                    placeholder="请逐个输入学员手机号码进行验证"
                    notFoundContent={fetching ? <Spin size="small" /> : <Tag color="red">{errorMsg}</Tag>}
                    filterOption={false}
                    onSelect={this.handleSelectStudent}
                    onChange={this.queryStudentList2}
                  >
                    {studentList.map((d, key) => <Option key={key} value={`${d.firstname}-${d.phone2}`}>{`${d.firstname}-${d.phone2}`}</Option>)}
                  </Select>
                </Col>
                <Col span={8} className={styles.text_right}>
                  <Button onClick={this.handleAddStudent} disabled={addDisabled} type="primary" size="large" icon="plus-circle-o">添加</Button>
                </Col>
              </Row> : <div />)}
            <ItemStudent lessonInfo={{ lessonid: item.id, categoryId: item.category_idnumber, available: item.available, deadline: item.deadline }} addDeletePower={addDeleteStudentPower} otherPower={otherStudentPower} />
          </FormItem>
          <FormItem wrapperCol={{ span: 17, offset: 4 }}>
            {updatePower && type === 'update' &&
              <Button className={styles.btn} onClick={this.handleUpdate} type="primary" size="large">修改</Button>
            }
            <Button className={styles.btn} type="default" onClick={onGoBack} size="large">返回</Button>
          </FormItem>
        </Form>
      </Spin>
    )
  }
}

export default Form.create()(ItemForm)
