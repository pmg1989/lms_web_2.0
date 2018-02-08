import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { checkPower } from 'utils'
import { ADD } from 'constants/options'
import ItemForm from './ItemForm'
import ResultListModal from './ResultListModal'

const namespace = 'lessonCreate'

const LessonItem = ({ dispatch, curPowers, lessonCreate, loading, modal, commonModel }) => {
  const addPower = checkPower(ADD, curPowers)

  const itemFormProps = {
    addPower,
    lessonItem: lessonCreate,
    loading: loading.models.lessonCreate,
    queryStudentsLoading: loading.effects[`${namespace}/queryStudents`],
    commonModel,
    onQueryStudentList (params, phone2) {
      dispatch({
        type: `${namespace}/queryStudents`,
        payload: { params, phone2 },
      })
    },
    onResetStudents () {
      dispatch({
        type: `${namespace}/resetStudents`,
      })
    },
    onSubmit (params) {
      dispatch({
        type: `${namespace}/create`,
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
      {modal.visible && <ResultListModal {...resultListModalProps} />}
    </div>
  )
}

LessonItem.propTypes = {
  dispatch: PropTypes.func.isRequired,
  curPowers: PropTypes.array.isRequired,
  lessonCreate: PropTypes.object.isRequired,
  loading: PropTypes.object.isRequired,
  modal: PropTypes.object.isRequired,
  commonModel: PropTypes.object.isRequired,
}

function mapStateToProps ({ lessonCreate, loading, modal, commonModel }) {
  return { lessonCreate, loading, modal, commonModel }
}

export default connect(mapStateToProps)(LessonItem)
