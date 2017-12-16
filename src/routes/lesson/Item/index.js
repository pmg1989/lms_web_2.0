import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'

const LessonItem = ({ lessonItem, loading }) => {
  console.log(lessonItem, loading)
  return (
    <div>
            LessonItem
    </div>
  )
}

LessonItem.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  lessonItem: PropTypes.object.isRequired,
  loading: PropTypes.object.isRequired,
}

function mapStateToProps ({ lessonItem, loading }) {
  return { lessonItem, loading }
}

export default connect(mapStateToProps)(LessonItem)
