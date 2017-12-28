import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import List from './List'

const namespace = 'lessonStudent'

const LessonItemStudent = ({ dispatch, addDeletePower, otherPower, lessonStudent, loading }) => {
  const listProps = {
    loading: loading.models.lessonStudent,
    addDeletePower,
    otherPower,
    lessonStudent,
    onDeleteItem (params) {
      dispatch({
        type: `${namespace}/remove`,
        payload: { params },
      })
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
  lessonStudent: PropTypes.object.isRequired,
  loading: PropTypes.object.isRequired,
}

function mapStateToProps ({ lessonStudent, loading }) {
  return { lessonStudent, loading }
}

export default connect(mapStateToProps)(LessonItemStudent)
