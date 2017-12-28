import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
// import { routerRedux } from 'dva/router'
// import { checkPower } from 'utils'
// import { ADD, UPDATE, ADD_DAI_TEACHER, ADD_DELETE_STUDENT } from 'constants/options'

// const namespace = 'lessonStudent'

const LessonStudent = ({ dispatch, curPowers, lessonStudent, loading }) => {
  console.log(dispatch, curPowers, lessonStudent, loading)
  //   const addPower = checkPower(ADD, curPowers)
  //   const updatePower = checkPower(UPDATE, curPowers)
  //   const addDaiTeacherPower = checkPower(ADD_DAI_TEACHER, curPowers)
  //   const addDeleteStudentPower = checkPower(ADD_DELETE_STUDENT, curPowers)

  //   const itemFormProps = {
  //     addPower,
  //     updatePower,
  //     addDaiTeacherPower,
  //     addDeleteStudentPower,
  //     lessonStudent,
  //     loading: loading.models.lessonItem,
  //   }

  return (
    <div className="content-inner">
      haha
    </div>
  )
}

LessonStudent.propTypes = {
  dispatch: PropTypes.func.isRequired,
  curPowers: PropTypes.array.isRequired,
  lessonStudent: PropTypes.object.isRequired,
  loading: PropTypes.object.isRequired,
}

function mapStateToProps ({ lessonStudent, loading }) {
  return { lessonStudent, loading }
}

export default connect(mapStateToProps)(LessonStudent)
