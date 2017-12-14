import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { checkPower } from 'utils'
import { DETAIL, UPDATE } from 'constants/options'
import Search from './Search'
import List from './List'

const namespace = 'lessonList'

function ListHome ({ curPowers, dispatch, lessonList, loading }) {
  const detailPower = checkPower(DETAIL, curPowers)
  const updatePower = checkPower(UPDATE, curPowers)

  const searchProps = {
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
    loading,
    detailPower,
    updatePower,
    onPageChange (fieldsValue) {
      dispatch({
        type: `${namespace}/query`,
        payload: { ...fieldsValue, isPostBack: false },
      })
    },
    onDetailItem (item) {
      dispatch({
        type: `${namespace}/showModal`,
        payload: { type: 'detail', curItem: item },
      })
    },
    onEditItem (item) {
      dispatch({
        type: `${namespace}/showModal`,
        payload: { type: 'update', curItem: item },
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
