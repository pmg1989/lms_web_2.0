import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { checkPower } from 'utils'
import { UPDATE } from 'constants/options'
import RoleList from './List'
import RoleModal from './ModalForm'

const namespace = 'accountRole'

function Role ({ curPowers, dispatch, accountRole, modal, loading }) {
  const updatePower = checkPower(UPDATE, curPowers)

  const listProps = {
    accountRole,
    loading: loading.effects[`${namespace}/query`],
    updatePower,
    onDeleteItem (id) {
      dispatch({ type: `${namespace}/delete`, payload: { id } })
    },
    onEditItem (item) {
      dispatch({
        type: 'modal/showModal',
        payload: {
          type: 'update',
          curItem: item,
        },
      })
    },
  }

  const modalProps = {
    modal,
    loading: loading.models.accountRole,
    onOk (data) {
      dispatch({
        type: data.id
          ? `${namespace}/update`
          : `${namespace}/create`,
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
      <RoleList {...listProps} />
      <RoleModal {...modalProps} />
    </div>
  )
}

Role.propTypes = {
  accountRole: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  curPowers: PropTypes.array.isRequired,
  modal: PropTypes.object.isRequired,
  loading: PropTypes.object.isRequired,
}

function mapStateToProps ({ accountRole, modal, loading }) {
  return { accountRole, modal, loading }
}

export default connect(mapStateToProps)(Role)
