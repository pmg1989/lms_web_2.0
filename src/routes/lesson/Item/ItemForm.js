import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Input, InputNumber, Select, Spin, Button, Row, Col, Checkbox, DatePicker, Tag, Icon } from 'antd'
import moment from 'moment'
import { Link } from 'dva/router'
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
    addPower: PropTypes.bool.isRequired,
    updatePower: PropTypes.bool.isRequired,
    addDaiTeacherPower: PropTypes.bool.isRequired,
    addDeleteStudentPower: PropTypes.bool.isRequired,
    otherStudentPower: PropTypes.bool.isRequired,
    lessonItem: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onGoBack: PropTypes.func.isRequired,
    onChangeDaiTeacher: PropTypes.func.isRequired,
    onQueryStudentList: PropTypes.func.isRequired,
  }

  state = {
    schoolId: getUserInfo().school_id,
    showStudentForm: true,
    timeStarts: timeList,
    timeEnds: timeList,
    teachers: [],
    fetching: false,
    errorMsg: '没有匹配的学员数据',
  }

  componentWillReceiveProps (nextProps) {
    const { lessonItem } = this.props
    const { lessonItem: { item, teachersDic } } = nextProps
    if (!lessonItem.item.category_summary && item.category_summary) {
      this.handleSchoolChange(item.school_id || this.state.schoolId, false)
      this.changeStudentForm(item.category_idnumber)
    }
    if (!Object.keys(lessonItem.teachersDic).length && Object.keys(teachersDic).length) {
      const teachersState = teachersDic[item.school_id || this.state.schoolId] || []
      teachersState.length && this.setState({ teachers: teachersState })
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
          <Col span={18}>
            {getFieldDecorator('teacher_substitute', {
              initialValue: teacherDaiId || undefined,
              onChange: handleDaiTeacherChange,
            })(<Select size="large" disabled={disabled || !addDaiTeacherPower} placeholder="--请选择添加代课老师--">
              {teachers.filter(cur => cur.id !== teacherId).map(teacher => <Option key={teacher.id} value={teacher.id.toString()}>{teacher.firstname}</Option>)}
            </Select>)
            }
          </Col>
          <Col span={6}>
            <Button size="large" type="danger" onClick={handleDeleteDaiTeacher} disabled={disabled || !addDaiTeacherPower}><Icon type="close-circle-o" />删除代课老师</Button>
          </Col>
        </Row>
      </FormItem>
    )
  }

  AddStudentFormItem = ({ disabled }) => {
    const { form: { getFieldDecorator, getFieldsValue }, lessonItem: { studentList }, onQueryStudentList } = this.props
    const { fetching, errorMsg } = this.state

    const handleMultipleChange = () => {
      this.setState({ fetching: false })
    }

    const queryStudentList = (phone2) => {
      const { school_id, available } = getFieldsValue(['school_id', 'available'])
      const params = getFieldsValue(['categoryid', 'teacherid', 'startdate', 'numsections', 'openweekday'])

      if (params.categoryid && params.teacherid && params.startdate && available && params.numsections && params.openweekday.length) {
        if (!(/^1(3|4|5|7|8)\d{9}$/.test(phone2))) {
          return false
        }

        this.setState({ fetching: true })
        params.startdate = moment(`${params.startdate.format('YYYY-MM-DD')} ${available}`).format('X')
        params.openweekday = params.openweekday.sort().join(',')
        console.log(school_id, params)
        // this.props.onQueryStudentList(params)
        onQueryStudentList({ phone2, school: '' })
      } else {
        console.log('error')
        this.setState({ fetching: false, errorMsg: '请先完善表单数据！' })
      }
      return true
    }

    return (
      <FormItem label="添加学员" hasFeedback {...formItemLayout} >
        {getFieldDecorator('studentid', {
        })(<Select
          disabled={disabled}
          mode="multiple"
          labelInValue
          placeholder="请逐个输入学员手机号码进行验证"
          notFoundContent={fetching ? <Spin size="small" /> : <Tag color="red">{errorMsg}</Tag>}
          filterOption={false}
          onChange={handleMultipleChange}
          onSearch={queryStudentList}
        >
          {studentList.map(d => <Option key={d.id} value={d.id}>{d.firstname}</Option>)}
        </Select>)}
      </FormItem>
    )
  }

  EditStudentFormItem = ({ disabled }) => {
    const { form: { getFieldDecorator, getFieldsValue }, lessonItem: { studentList }, onQueryStudentList } = this.props
    const { fetching, errorMsg } = this.state

    const handleMultipleChange = () => {
      this.setState({ fetching: false })
    }

    const queryStudentList = (phone2) => {
      const { school_id, available } = getFieldsValue(['school_id', 'available'])
      const params = getFieldsValue(['categoryid', 'teacherid', 'startdate', 'numsections', 'openweekday'])

      if (params.categoryid && params.teacherid && params.startdate && available && params.numsections && params.openweekday.length) {
        if (!(/^1(3|4|5|7|8)\d{9}$/.test(phone2))) {
          return false
        }

        this.setState({ fetching: true })
        params.startdate = moment(`${params.startdate.format('YYYY-MM-DD')} ${available}`).format('X')
        params.openweekday = params.openweekday.sort().join(',')
        console.log(school_id, params)
        // this.props.onQueryStudentList(params)
        onQueryStudentList({ phone2, school: '' })
      } else {
        console.log('error')
        this.setState({ fetching: false, errorMsg: '请先完善表单数据！' })
      }
      return true
    }

    return (
      <FormItem label="添加学员" hasFeedback {...formItemLayout} >
        {getFieldDecorator('studentid', {
        })(<Select
          disabled={disabled}
          mode="multiple"
          labelInValue
          placeholder="请逐个输入学员手机号码进行验证"
          notFoundContent={fetching ? <Spin size="small" /> : <Tag color="red">{errorMsg}</Tag>}
          filterOption={false}
          onChange={handleMultipleChange}
          onSearch={queryStudentList}
        >
          {studentList.map(d => <Option key={d.id} value={d.id}>{d.firstname}</Option>)}
        </Select>)}
      </FormItem>
    )
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

  handleSchoolChange = (schoolId, needSetValue = true) => {
    this.setState({ schoolId })
    if (needSetValue) {
      const { form: { setFieldsValue, getFieldValue }, lessonItem: { teachersDic, courseCategorys } } = this.props
      const categoryid = getFieldValue('categoryid')
      const courseCategory = courseCategorys.find(cur => cur.id === categoryid)
      const teachers = teachersDic[schoolId] || []
      this.setState({ teachers: teachers.filter(cur => courseCategory && courseCategory.idnumber.includes(cur.teacher_subject)) })
      setFieldsValue({ teacherid: undefined, classroomid: undefined })
    }
  }

  handleCategoryChange = (categoryid) => {
    const { lessonItem: { courseCategorys, teachersDic }, form: { getFieldValue, setFieldsValue } } = this.props
    const courseCategory = courseCategorys.find(cur => cur.id === categoryid)
    const schoolId = getFieldValue('school_id')
    const teachers = teachersDic[schoolId] || []
    this.setState({ teachers: teachers.filter(cur => courseCategory.idnumber.includes(cur.teacher_subject)) })

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
        delete values.school_id
        onSubmit(values)
      }
    })
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
      lessonItem: { type, item, courseCategorys, schools, classroomsDic },
      addPower, updatePower, addDeleteStudentPower, otherStudentPower,
      loading, onGoBack,
      form: { getFieldDecorator },
    } = this.props
    const { schoolId, showStudentForm, teachers, timeStarts, timeEnds } = this.state

    const disabled = type === 'detail'
    const disabledEdit = type === 'update'
    const classrooms = classroomsDic[schoolId] || []

    const courseCategorysProps = {
      showSearch: true,
      placeholder: '--请选择课程类型--',
      optionFilterProp: 'children',
      filterOption: (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0,
    }

    const teacherId = teachers.length && item.teacher && teachers.find(cur => cur.firstname === item.teacher).id

    return (
      <Spin spinning={loading} size="large">
        <Form className={styles.form_box}>
          <FormItem label="课程类型" hasFeedback {...formItemLayout} extra="支持输入关键字筛选">
            {getFieldDecorator('categoryid', {
              initialValue: item.categoryid && item.categoryid.toString(),
              // initialValue: courseCategorys[0] && courseCategorys[0].id,
              onChange: this.handleCategoryChange,
              rules: [
                {
                  required: true,
                  message: '请输入课程类型',
                },
              ],
            })(<Select disabled={disabled || disabledEdit} {...courseCategorysProps}>
              {courseCategorys.map(courseCategory => <Option key={courseCategory.id} value={courseCategory.id.toString()}>{courseCategory.description}</Option>)}
            </Select>)}
          </FormItem>
          {type !== 'create' &&
            <FormItem label="课程编号" hasFeedbac {...formItemLayout}>
              {getFieldDecorator('course_idnumber', {
                initialValue: item.course_idnumber,
                rules: [
                  {
                    required: true,
                    message: '请输入课程名称',
                  },
                ],
              })(<Input disabled={disabled || disabledEdit} placeholder="请输入课程名称" />)}
            </FormItem>
          }
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
            {getFieldDecorator('teacherid', {
              initialValue: teacherId || undefined,
              rules: [
                {
                  required: true,
                  message: '请选择老师',
                },
              ],
            })(<Select disabled={disabled || disabledEdit} placeholder="--请选择老师--">
              {teachers.map(teacher => <Option key={teacher.id} value={teacher.id.toString()}>{teacher.firstname}</Option>)}
            </Select>)
            }
          </FormItem>
          {type !== 'create' && <this.TeacherDaiFormItem teacherId={teacherId} disabled={disabled} />}
          <FormItem label="教室" hasFeedback {...formItemLayout}>
            {getFieldDecorator('classroomid', {
              initialValue: item.classroomid && item.classroomid.toString(),
              rules: [
                {
                  required: true,
                  message: '请选择教室',
                },
              ],
            })(<Select disabled={disabled || disabledEdit} placeholder="--请选择教室--">
              {classrooms.map(classroom => <Option key={classroom.id} value={classroom.id.toString()}>{classroom.name}</Option>)}
            </Select>)
            }
          </FormItem>
          {type === 'create' &&
            <FormItem label="每周" hasFeedback {...formItemLayout}>
              {getFieldDecorator('openweekday', {
                initialValue: item.openweekday && item.openweekday.split(','),
                onChange: this.handleWeekdayChange,
                rules: [
                  {
                    required: true,
                    message: '请选择每周工作日',
                  },
                ],
              })(<Checkbox.Group disabled={disabled} placeholder="--请选择每周工作日--">
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
          }
          {type === 'create' &&
            <FormItem label="持续周数" hasFeedback {...formItemLayout}>
              {getFieldDecorator('numsections', {
                initialValue: item.numsections || 4,
                rules: [
                  {
                    required: true,
                    message: '请输入持续周数',
                  },
                ],
              })(<InputNumber min={1} disabled={disabled} placeholder="请输入持续周数" />)
              }
            </FormItem>
          }
          <FormItem label="上课日期" hasFeedback {...formItemLayout}>
            {getFieldDecorator('startdate', {
              initialValue: item.available && moment.unix(item.available),
              rules: [
                {
                  required: true,
                  message: '请选择上课日期',
                },
              ],
            })(<DatePicker disabled={disabled}
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
                })(<Select className={styles.date_picker} disabled={disabled} placeholder="--请选择上课时间--">
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
                })(<Select className={styles.date_picker} disabled={disabled} placeholder="--请选择下课时间--">
                  {timeEnds.map(time => <Option key={time} value={time}>{time}</Option>)}
                </Select>)
                }
              </FormItem>
            </Col>
          </FormItem>
          {type === 'create' && showStudentForm && <this.AddStudentFormItem disabled={disabled} />}
          {type !== 'create' &&
          <FormItem label="修改学员" hasFeedback {...formItemLayout}>
            <ItemStudent lessonInfo={{ id: item.id, categoryId: item.category_idnumber }} addDeletePower={addDeleteStudentPower} otherPower={otherStudentPower} />
          </FormItem>}
          <FormItem wrapperCol={{ span: 17, offset: 4 }}>
            {addPower &&
              <Button className={styles.btn} onClick={this.handleAdd} type="primary" htmlType="submit" size="large">创建</Button>
            }
            {updatePower && type === 'update' &&
              <Button className={styles.btn} onClick={this.handleUpdate} type="primary" size="large">修改</Button>
            }
            {updatePower && type === 'detail' &&
              <Link to={`/lesson/update?lessonid=${item.id}`}><Button className={styles.btn} type="primary" size="large">修改</Button></Link>
            }
            <Button className={styles.btn} type="default" onClick={onGoBack} size="large">返回</Button>
          </FormItem>
        </Form>
      </Spin>
    )
  }
}

export default Form.create()(ItemForm)
