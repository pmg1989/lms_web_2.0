import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { checkPower } from 'utils'
import { ADD, UPDATE, ADD_DAI_TEACHER, ADD_DELETE_STUDENT, OTHER_STUDENT } from 'constants/options'
import ItemForm from './ItemForm'
import ResultListModal from './ResultListModal'

const namespace = 'lessonItem'

const LessonItem = ({ dispatch, location, curPowers, lessonItem, loading, modal, commonModel }) => {
  const addPower = checkPower(ADD, curPowers)
  const updatePower = checkPower(UPDATE, curPowers)
  const addDaiTeacherPower = checkPower(ADD_DAI_TEACHER, curPowers)
  const addDeleteStudentPower = checkPower(ADD_DELETE_STUDENT, curPowers)
  const otherStudentPower = checkPower(OTHER_STUDENT, curPowers)

  const itemFormProps = {
    addPower,
    updatePower,
    addDaiTeacherPower,
    addDeleteStudentPower,
    otherStudentPower,
    lessonItem,
    commonModel,
    loading: loading.models.lessonItem,
    queryStudentsLoading: loading.effects[`${namespace}/queryStudents`],
    queryStudents2Loading: loading.effects[`${namespace}/queryStudents2`],
    onChangeDaiTeacher ({ type, params }) {
      dispatch({
        type: `${namespace}/changeDaiTeacher`,
        payload: { type, params },
      })
    },
    onQueryStudentList (params, phone2) {
      dispatch({
        type: `${namespace}/queryStudents`,
        payload: { params, phone2 },
      })
    },
    onQueryStudentList2 (params, phone2) {
      dispatch({
        type: `${namespace}/queryStudents2`,
        payload: { params, phone2 },
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
        type: params.lessonid ? `${namespace}/update` : `${namespace}/create`,
        payload: { params },
      })
    },
    onGoBack () {
      const { query } = location
      if (query.from) {
        dispatch(routerRedux.push({
          pathname: query.from,
          query: { back: 1 },
        }))
      } else {
        dispatch(routerRedux.goBack())
      }
    },
    onResetItem () {
      dispatch({ type: `${namespace}/resetItem` })
    },
  }

  const resultListModalProps = {
    modal,
    onCancel () {
      dispatch({ type: 'modal/hideModal' })
      dispatch(routerRedux.goBack())
    },
  }

  return (
    <div className="content-inner">
      <ItemForm {...itemFormProps} />
      {modal.visible && modal.id === 4 && <ResultListModal {...resultListModalProps} />}
    </div>
  )
}

LessonItem.propTypes = {
  dispatch: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  curPowers: PropTypes.array.isRequired,
  lessonItem: PropTypes.object.isRequired,
  loading: PropTypes.object.isRequired,
  modal: PropTypes.object.isRequired,
  commonModel: PropTypes.object.isRequired,
}

function mapStateToProps ({ lessonItem, loading, modal, commonModel }) {
  return { lessonItem, loading, modal, commonModel }
}

export default connect(mapStateToProps)(LessonItem)
