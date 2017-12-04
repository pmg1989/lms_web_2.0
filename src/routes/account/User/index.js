import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { checkPower } from 'utils'
import { DETAIL, UPDATE, SET_TEACHER, GET_HISTORY_LIST } from 'constants/options'
import List from './List'
import Search from './Search'
import Modal from './ModalForm'
import TeacherModal from './TeacherModal'

function User ({ location, curPowers, dispatch, accountUser, modal, loading }) {
  const detailPower = checkPower(DETAIL, curPowers)
  const updatePower = checkPower(UPDATE, curPowers)
  const setTeacherPower = checkPower(SET_TEACHER, curPowers)
  const getHistoryPower = checkPower(GET_HISTORY_LIST, curPowers)

  const { field, keyword } = location.query

  const searchProps = {
    field,
    keyword,
    onSearch (fieldsValue) {
      const { pathname } = location
      fieldsValue.keyword.length
        ? dispatch(routerRedux.push({
          pathname,
          query: {
            ...fieldsValue,
          },
        }))
        : dispatch(routerRedux.push({ pathname }))
    },
  }

  const listProps = {
    accountUser,
    location,
    loading,
    detailPower,
    updatePower,
    onDetailItem (item) {
      dispatch({
        type: 'accountUser/showModal',
        payload: {
          type: 'update',
          curItem: item,
        },
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'accountUser/showModal',
        payload: {
          type: 'update',
          curItem: item,
        },
      })
    },
  }

  const modalProps = {
    modal,
    loading,
    setTeacherPower,
    getHistoryPower,
    onCancel () {
      dispatch({ type: 'modal/hideModal' })
    },
    onShowTeacherModal () {
      dispatch({
        type: 'accountUser/showTeacherModal',
        payload: {
          type: 'update',
          id: 2,
        },
      })
    },
  }

  const teacherModalProps = {
    modal,
    loading,
    onCancel () {
      dispatch({ type: 'modal/hideModal', payload: { showParent: true } })
    },
  }

  return (
    <div className="content-inner">
      <Search {...searchProps} />
      <List {...listProps} />
      {modal.visible && modal.id >= 1 && <Modal {...modalProps} />}
      {modal.visible && modal.id === 2 && <TeacherModal {...teacherModalProps} />}
    </div>
  )
}

User.propTypes = {
  location: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  accountUser: PropTypes.object.isRequired,
  curPowers: PropTypes.array.isRequired,
  loading: PropTypes.object.isRequired,
  modal: PropTypes.object.isRequired,
}

function mapStateToProps ({ accountUser, modal, loading }) {
  return { accountUser, modal, loading }
}

export default connect(mapStateToProps)(User)
