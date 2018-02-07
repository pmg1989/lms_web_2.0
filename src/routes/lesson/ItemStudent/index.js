import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import List from './List'
import CommentModal from './CommentModal'
import RecordModal from './RecordModal'
import FeedbackModal from './FeedbackModal'

const namespace = 'lessonStudent'

const LessonItemStudent = ({ dispatch, user, lessonInfo: { lessonid, categoryId, available, deadline }, addDeletePower, otherPower, lessonStudent, loading, modal }) => {
  const listProps = {
    lessonInfo: { available, deadline },
    loading: loading.models.lessonStudent,
    addDeletePower,
    otherPower,
    uploadRecordStatus: !!categoryId && categoryId.includes('jl-') && user.teacher_category === 'jl',
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
    onShowModal ({ modalId, type, userid, curItem }) {
      if (modalId === 1) {
        dispatch({
          type: `${namespace}/showCommentModal`,
          payload: { type, params: { userid, lessonid } },
        })
      } else if (modalId === 2) {
        dispatch({
          type: `${namespace}/showRecordModal`,
          payload: { type, curItem: { ...curItem, lessonid } },
        })
      } else {
        dispatch({
          type: `${namespace}/showFeedbackModal`,
          payload: { type, params: { userid, lessonid } },
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

  const feedbackModalProps = {
    modal,
    loading: loading.models.lessonStudent,
    onCancel () {
      dispatch({ type: 'modal/hideModal' })
    },
  }

  const recordModalProps = {
    modal,
    loading: {
      record: loading.effects[`${namespace}/record`],
      upload: loading.effects[`${namespace}/upload`],
      removeUpload: loading.effects[`${namespace}/removeUpload`],
    },
    onUpload (params) {
      dispatch({
        type: `${namespace}/uploadRecord`,
        payload: { params },
      })
    },
    onOk (data) {
      dispatch({
        type: `${namespace}/updateSong`,
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
      {modal.visible && modal.id === 2 && <RecordModal {...recordModalProps} />}
      {modal.visible && modal.id === 3 && <FeedbackModal {...feedbackModalProps} />}
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
