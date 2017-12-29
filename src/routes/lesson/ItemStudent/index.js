import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import List from './List'
import CommentModal from './CommentModal'

const namespace = 'lessonStudent'

const LessonItemStudent = ({ dispatch, user, lessonInfo: { lessonid, categoryId }, addDeletePower, otherPower, lessonStudent, loading, modal }) => {
  const listProps = {
    loading: loading.effects['lessonStudent/query'],
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
          payload: { type: 'update', params: { userid, lessonid } },
        })
      } else if (modalId === 2) {
        dispatch({
          type: `${namespace}/showRecordModal`,
          payload: { type: 'update', params: { userid, lessonid } },
        })
      } else {
        dispatch({
          type: `${namespace}/showFeedbackModal`,
          payload: { type: 'detail', params: { userid, lessonid } },
        })
      }
    },
  }

  const commentModalProps = {
    modal,
    loading: loading.models.lessonStudent,
    onOk (data) {
      dispatch({
        type: `${namespace}/comment`,
        payload: {
          params: { ...data, lessonid },
        },
      })
    },
    onCancel () {
      dispatch({ type: 'modal/hideModal' })
    },
  }

  return (
    <div>
      <List {...listProps} />
      {modal.visible && modal.id === 1 && <CommentModal {...commentModalProps} />}
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
  modal: PropTypes.object.isRequired,
}

function mapStateToProps ({ lessonStudent, loading, modal, app: { user } }) {
  return { lessonStudent, loading, modal, user }
}

export default connect(mapStateToProps)(LessonItemStudent)
