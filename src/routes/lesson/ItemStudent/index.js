import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import List from './List'

const namespace = 'lessonStudent'

const LessonItemStudent = ({ dispatch, user, lessonInfo: { lessonid, categoryId }, addDeletePower, otherPower, lessonStudent, loading }) => {
  const listProps = {
    loading: loading.models.lessonStudent,
    addDeletePower,
    otherPower,
    uploadRecordStatus: categoryId.includes('jl-') && user.teacher_category === 'jl',
    lessonStudent,
    onDeleteItem (item) {
      dispatch({
        type: `${namespace}/remove`,
        payload: { params: { ...item, lessonid } },
      })
    },
    onAttendance (item) {
      dispatch({
        type: `${namespace}/attendance`,
        payload: { params: { ...item, lessonid } },
      })
    },
    onShowModal (modalId, userid) {
      if (modalId === 1) {
        dispatch({
          type: `${namespace}/showCommentModal`,
          payload: { params: { userid, lessonid } },
        })
      } else if (modalId === 2) {
        dispatch({
          type: `${namespace}/showRecordModal`,
          payload: { params: { userid, lessonid } },
        })
      } else {
        dispatch({
          type: `${namespace}/showFeedbackModal`,
          payload: { params: { userid, lessonid } },
        })
      }
    },
  }

  return (
    <div>
      <List {...listProps} />
    </div>
  )
}

LessonItemStudent.propTypes = {
  dispatch: PropTypes.func.isRequired,
  addDeletePower: PropTypes.bool.isRequired,
  otherPower: PropTypes.bool.isRequired,
  lessonInfo: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  lessonStudent: PropTypes.object.isRequired,
  loading: PropTypes.object.isRequired,
}

function mapStateToProps ({ lessonStudent, loading, app: { user } }) {
  return { lessonStudent, loading, user }
}

export default connect(mapStateToProps)(LessonItemStudent)
