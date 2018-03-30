import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { checkPower } from 'utils'
import { UPDATE, DELETE, ADD_DAI_TEACHER, ADD_DELETE_STUDENT, OTHER_STUDENT } from 'constants/options'
import ItemForm from './ItemForm'

const namespace = 'lessonItem'

const LessonItem = ({ dispatch, curPowers, lessonItem, loading, commonModel }) => {
  const updatePower = checkPower(UPDATE, curPowers)
  const deletePower = checkPower(DELETE, curPowers)
  const addDaiTeacherPower = checkPower(ADD_DAI_TEACHER, curPowers)
  const addDeleteStudentPower = checkPower(ADD_DELETE_STUDENT, curPowers)
  const otherStudentPower = checkPower(OTHER_STUDENT, curPowers)

  const itemFormProps = {
    updatePower,
    deletePower,
    addDaiTeacherPower,
    addDeleteStudentPower,
    otherStudentPower,
    lessonItem,
    commonModel,
    loading: loading.effects[`${namespace}/query`],
    queryStudents2Loading: loading.effects[`${namespace}/queryStudents2`],
    onChangeDaiTeacher ({ type, params }) {
      dispatch({
        type: `${namespace}/changeDaiTeacher`,
        payload: { type, params },
      })
    },
    onQueryStudentList2 (params) {
      dispatch({
        type: `${namespace}/queryStudents2`,
        payload: { params },
      })
    },
    onAddStudent (params) {
      dispatch({
        type: 'lessonStudent/addStudent',
        payload: { params },
      })
    },
    onResetStudents () {
      dispatch({
        type: `${namespace}/resetStudents`,
      })
    },
    onSubmit (params) {
      dispatch({
        type: `${namespace}/update`,
        payload: { params },
      })
    },
    onGoBack () {
      dispatch(routerRedux.goBack())
    },
    onResetItem () {
      dispatch({ type: `${namespace}/resetItem` })
      dispatch({ type: 'lessonStudent/resetStudents' })
    },
    onDeleteItem (params) {
      dispatch({
        type: `${namespace}/remove`,
        payload: { params },
      })
    },
    onDeleteCourseItem (params) {
      dispatch({
        type: `${namespace}/removeCourse`,
        payload: { params },
      })
    },
  }

  return (
    <div className="content-inner">
      <ItemForm {...itemFormProps} />
    </div>
  )
}

LessonItem.propTypes = {
  dispatch: PropTypes.func.isRequired,
  curPowers: PropTypes.array.isRequired,
  lessonItem: PropTypes.object.isRequired,
  loading: PropTypes.object.isRequired,
  commonModel: PropTypes.object.isRequired,
}

function mapStateToProps ({ lessonItem, loading, commonModel }) {
  return { lessonItem, loading, commonModel }
}

export default connect(mapStateToProps)(LessonItem)
