import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { checkPower } from 'utils'
import { ADD, UPDATE, ADD_DAI_TEACHER, ADD_DELETE_STUDENT, OTHER_STUDENT } from 'constants/options'
import ItemForm from './ItemForm'
import ResultListModal from './ResultListModal'

const namespace = 'lessonItem'

const LessonItem = ({ dispatch, curPowers, lessonItem, loading, modal, commonModel }) => {
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
    onChangeDaiTeacher ({ type, params }) {
      dispatch({
        type: `${namespace}/changeDaiTeacher`,
        payload: { type, params },
      })
    },
    onQueryStudentList (params) {
      dispatch({
        type: `${namespace}/queryStudents`,
        payload: params,
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
      dispatch(routerRedux.goBack())
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
