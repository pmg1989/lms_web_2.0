import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { checkPower } from 'utils'
import { DETAIL, UPDATE, SET_TEACHER, GET_HISTORY_LIST } from 'constants/options'
import List from './List'
import Search from './Search'
import Modal from './ModalForm'
import TeacherModal from './TeacherModal'
import HistoryListModal from './HistoryListModal'

const namespace = 'accountUser'

function User ({ curPowers, dispatch, accountUser, modal, loading }) {
  const detailPower = checkPower(DETAIL, curPowers)
  const updatePower = checkPower(UPDATE, curPowers)
  const setTeacherPower = checkPower(SET_TEACHER, curPowers)
  const getHistoryPower = checkPower(GET_HISTORY_LIST, curPowers)

  const searchProps = {
    schools: accountUser.schools,
    onSearch (fieldsValue) {
      dispatch({
        type: `${namespace}/query`,
        payload: { current: 1, ...fieldsValue },
      })
    },
  }

  const listProps = {
    accountUser,
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

  const modalProps = {
    modal,
    loading,
    setTeacherPower,
    getHistoryPower,
    onCancel () {
      dispatch({ type: 'modal/hideModal' })
    },
    onShowTeacherModal (item) {
      dispatch({
        type: `${namespace}/showTeacherModal`,
        payload: {
          type: 'update',
          id: 2,
          contract: item,
        },
      })
    },
    onShowHistoryListModal (item) {
      dispatch({
        type: `${namespace}/showHistoryListModal`,
        payload: {
          type: 'detail',
          id: 3,
          contract: item,
        },
      })
    },
  }

  const teacherModalProps = {
    modal,
    loading,
    onOk (curItem) {
      dispatch({
        type: `${namespace}/setTeacher`,
        payload: { curItem },
      })
    },
    onCancel () {
      dispatch({ type: 'modal/hideModal', payload: { showParent: true } })
    },
  }

  const historyListModalProps = {
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
      {modal.visible && modal.id === 3 && <HistoryListModal {...historyListModalProps} />}
    </div>
  )
}

User.propTypes = {
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
