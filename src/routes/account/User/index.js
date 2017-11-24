import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { checkPower } from 'utils'
import { UPDATE } from 'constants/options'
import UserList from './List'
import UserSearch from './Search'
import UserModal from './ModalForm'

function User ({ location, curPowers, dispatch, accountUser, modal, loading }) {
  const updatePower = checkPower(UPDATE, curPowers)

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
    loading,
    updatePower,
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
    onOk (data) {
      dispatch({
        type: data.id
          ? 'accountUser/update'
          : 'accountUser/create',
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
      <UserSearch {...searchProps} />
      <UserList {...listProps} />
      <UserModal {...modalProps} />
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
