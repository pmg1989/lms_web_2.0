import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { checkPower } from 'utils'
import { DETAIL, ADD, UPDATE, DELETE } from 'constants/options'
import Search from './Search'
import List from './List'

const namespace = 'lessonList'

function ListHome ({ curPowers, dispatch, lessonList, loading }) {
  const detailPower = checkPower(DETAIL, curPowers)
  const addPower = checkPower(ADD, curPowers)
  const updatePower = checkPower(UPDATE, curPowers)
  const deletePower = checkPower(DELETE, curPowers)

  const searchProps = {
    addPower,
    searchQuery: lessonList.searchQuery,
    schools: lessonList.schools,
    categorys: lessonList.categorys,
    teachersDic: lessonList.teachersDic,
    onSearch (fieldsValue) {
      dispatch({
        type: `${namespace}/query`,
        payload: { ...fieldsValue, isPostBack: true },
      })
    },
  }

  const listProps = {
    lessonList,
    loading: loading.models.lessonList,
    detailPower,
    updatePower,
    deletePower,
    onPageChange (fieldsValue) {
      dispatch({
        type: `${namespace}/query`,
        payload: { ...fieldsValue, isPostBack: false },
      })
    },
    onDeleteItem (params) {
      dispatch({
        type: `${namespace}/remove`,
        payload: { params },
      })
    },
    onDeleteCourseItem (params) {
      dispatch({
        type: `${namespace}/removeCourse`,
        payload: { params },
      })
    },
    onDeleteBatch (params) {
      dispatch({
        type: `${namespace}/removeBatch`,
        payload: { params },
      })
    },
  }

  return (
    <div className="content-inner">
      <Search {...searchProps} />
      <List {...listProps} />
    </div>
  )
}

ListHome.propTypes = {
  curPowers: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
  lessonList: PropTypes.object.isRequired,
  loading: PropTypes.object.isRequired,
}

function mapStateToProps ({ lessonList, loading }) {
  return { lessonList, loading }
}

export default connect(mapStateToProps)(ListHome)
