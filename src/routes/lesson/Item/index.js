import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import ItemForm from './ItemForm'

const namespace = 'lessonItem'

const LessonItem = ({ dispatch, lessonItem, loading }) => {
  const itemFormProps = {
    lessonItem,
    loading: loading.models.lessonItem,
    onQueryStudentList (params) {
      dispatch({
        type: `${namespace}/queryStudents`,
        payload: params,
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

  return (
    <div className="content-inner">
      <ItemForm {...itemFormProps} />
    </div>
  )
}

LessonItem.propTypes = {
  dispatch: PropTypes.func.isRequired,
  lessonItem: PropTypes.object.isRequired,
  loading: PropTypes.object.isRequired,
}

function mapStateToProps ({ lessonItem, loading }) {
  return { lessonItem, loading }
}

export default connect(mapStateToProps)(LessonItem)
