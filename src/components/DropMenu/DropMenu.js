import React from 'react'
import PropTypes from 'prop-types'
import { Dropdown, Icon, Button } from 'antd'
import { isMobile } from 'utils'

const _isMobile = isMobile()

function DropMenu ({ border, dropDownProps, children }) {
  const dropProps = {
    overlay: children,
    placement: 'bottomCenter',
    trigger: _isMobile ? ['click'] : ['hover'],
    ...dropDownProps,
  }

  return (
    <Dropdown {...dropProps}>
      <Button style={{ border: border ? '1px solid #e3e3e3' : 'none' }}>
        <Icon style={{ marginRight: 2 }} type="bars" />
        <Icon type="down" />
      </Button>
    </Dropdown>
  )
}

DropMenu.propTypes = {
  border: PropTypes.bool,
  dropDownProps: PropTypes.object,
  children: PropTypes.element.isRequired,
}

export default DropMenu
