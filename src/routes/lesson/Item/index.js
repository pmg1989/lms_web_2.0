import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import ItemForm from './ItemForm'

const LessonItem = ({ lessonItem, loading }) => {
  const itemFormProps = {
    lessonItem,
    loading: loading.models.lessonItem,
  }

  return (
    <div className="content-inner">
      <ItemForm {...itemFormProps} />
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
