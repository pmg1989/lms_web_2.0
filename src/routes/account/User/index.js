import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { checkPower } from 'utils'
import { DETAIL, SET_TEACHER, GET_HISTORY_LIST } from 'constants/options'
import List from './List'
import Search from './Search'
import Modal from './ModalForm'
import TeacherModal from './TeacherModal'
import HistoryListModal from './HistoryListModal'
import LessonsModal from './LessonsModal'
import FreezeModal from './FreezeModal'

const namespace = 'accountUser'

function User ({ curPowers, dispatch, accountUser, modal, loading, commonModel, user }) {
  const detailPower = checkPower(DETAIL, curPowers)
  const setTeacherPower = checkPower(SET_TEACHER, curPowers)
  const getHistoryPower = checkPower(GET_HISTORY_LIST, curPowers)

  const searchProps = {
    schools: commonModel.schools,
    onSearch (fieldsValue) {
      dispatch({
        type: `${namespace}/query`,
        payload: { current: 1, ...fieldsValue },
      })
    },
  }

  const isTeacher = user.rolename === 'teacher'

  const listProps = {
    accountUser,
    schools: commonModel.schools,
    loading: loading.effects[`${namespace}/query`],
    detailPower,
    isTeacher,
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
    onFreezeItem (item) {
      dispatch({
        type: `${namespace}/showFreezeModal`,
        payload: { type: 'detail', id: 5, curItem: item },
      })
    },
  }

  const modalProps = {
    modal,
    isTeacher,
    loading: loading.effects[`${namespace}/showModal`],
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
    onShowContractLessonModal (item) {
      dispatch({
        type: `${namespace}/showContractLessonModal`,
        payload: {
          type: 'detail',
          id: 4,
          contract: item,
        },
      })
    },
  }

  const teacherModalProps = {
    modal,
    loading: loading.models.accountUser,
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
    loading: loading.models.accountUser,
    onCancel () {
      dispatch({ type: 'modal/hideModal', payload: { showParent: true } })
    },
  }

  const lessonsModalProps = {
    modal,
    loading: loading.models.accountUser,
    onCancel () {
      dispatch({ type: 'modal/hideModal', payload: { showParent: true } })
    },
    onCancelAll () {
      dispatch({ type: 'modal/hideModal' })
    },
  }

  const freezeModalProps = {
    modal,
    loading: loading.models.accountUser,
    onCancel () {
      dispatch({ type: 'modal/hideModal' })
    },
  }

  return (
    <div className="content-inner">
      <Search {...searchProps} />
      <List {...listProps} />
      {modal.visible && modal.id >= 1 && modal.id !== 5 && <Modal {...modalProps} />}
      {modal.visible && modal.id === 2 && <TeacherModal {...teacherModalProps} />}
      {modal.visible && modal.id === 3 && <HistoryListModal {...historyListModalProps} />}
      {modal.visible && modal.id === 4 && <LessonsModal {...lessonsModalProps} />}
      {modal.visible && modal.id === 5 && <FreezeModal {...freezeModalProps} />}
    </div>
  )
}

User.propTypes = {
  dispatch: PropTypes.func.isRequired,
  accountUser: PropTypes.object.isRequired,
  curPowers: PropTypes.array.isRequired,
  loading: PropTypes.object.isRequired,
  modal: PropTypes.object.isRequired,
  commonModel: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
}

function mapStateToProps ({ accountUser, modal, loading, commonModel, app }) {
  return { accountUser, modal, loading, commonModel, user: app.user }
}

export default connect(mapStateToProps)(User)
