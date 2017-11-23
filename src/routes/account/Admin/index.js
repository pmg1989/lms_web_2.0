import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Modal } from 'antd'
import { checkPower } from 'utils'
import { ADD, UPDATE, DETAIL, RESIGN, LEAVE } from 'constants/options'
import List from './List'
import Search from './Search'
import ModalForm from './ModalForm'
import LevelModal from './LevelModal'

const confirm = Modal.confirm

function Admin ({ location, dispatch, curPowers, accountAdmin, modal, loading }) {
  const addPower = checkPower(ADD, curPowers)
  const updatePower = checkPower(UPDATE, curPowers)
  const detailPower = checkPower(DETAIL, curPowers)
  const resignPower = checkPower(RESIGN, curPowers)
  const leavePower = checkPower(LEAVE, curPowers)

  const searchProps = {
    query: location.query,
    addPower,
    onSearch (fieldsValue) {
      dispatch(routerRedux.push({
        pathname: location.pathname,
        query: {
          ...fieldsValue,
        },
      }))
    },
    onAdd () {
      dispatch({
        type: 'accountAdmin/showModal',
        payload: {
          type: 'create',
        },
      })
    },
  }

  const listProps = {
    accountAdmin,
    loading,
    location,
    updatePower,
    detailPower,
    resignPower,
    leavePower,
    onEditItem (item) {
      dispatch({
        type: 'accountAdmin/showModal',
        payload: {
          type: 'update',
          curItem: item,
        },
      })
    },
    onDetailItem (item) {
      dispatch({
        type: 'accountAdmin/showModal',
        payload: {
          type: 'detail',
          curItem: item,
        },
      })
    },
    onResignItem (item) {
      dispatch({
        type: 'accountAdmin/toggleResign',
        payload: {
          curItem: item,
        },
      })
    },
    onLeaveItem (item) {
      if (item.teacher_status === 'normal') {
        dispatch({
          type: 'accountAdmin/showLeaveModal',
          payload: {
            type: 'update',
            curItem: item,
          },
        })
      } else {
        confirm({
          title: `您确定要取消${item.firstname}的请假吗?`,
          onOk () {
            dispatch({
              type: 'accountAdmin/cancelLevelTeacher',
              payload: {
                curItem: item,
              },
            })
          },
        })
      }
    },
  }

  const modalProps = {
    modal,
    loading,
    onOk (data) {
      dispatch({
        type: data.userid
          ? 'accountAdmin/update'
          : 'accountAdmin/create',
        payload: {
          curItem: data,
        },
      })
    },
    onCancel () {
      dispatch({ type: 'modal/hideModal' })
    },
  }

  const levalModalProps = {
    modal,
    loading,
    onOk (data) {
      dispatch({
        type: 'accountAdmin/levelTeacher',
        payload: {
          curItem: data,
        },
      })
    },
    onCancel () {
      dispatch({ type: 'modal/hideModal' })
    },
  }

  return (
    <div className="content-inner">
      <Search {...searchProps} />
      <List {...listProps} />
      {modal.visible && modal.id === 1 && <ModalForm {...modalProps} />}
      {modal.visible && modal.id === 2 && <LevelModal {...levalModalProps} />}
    </div>
  )
}

Admin.propTypes = {
  location: PropTypes.object,
  dispatch: PropTypes.func,
  curPowers: PropTypes.array,
  accountAdmin: PropTypes.object,
  modal: PropTypes.object,
  loading: PropTypes.object.isRequired,
}

function mapStateToProps ({ accountAdmin, modal, loading }) {
  return { accountAdmin, modal, loading }
}

export default connect(mapStateToProps)(Admin)
