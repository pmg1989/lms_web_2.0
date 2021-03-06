import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Icon } from 'antd'
import { Link } from 'dva/router'
import QueueAnim from 'rc-queue-anim'
import Immutable from 'immutable'
import { menu } from 'utils'
import { stringify } from 'qs'

const immutableMenu = Immutable.fromJS(menu)

const renderOutLink = (link) => {
  window.open(link)
}

function Menus ({ siderFold, darkTheme, location, handleClickNavMenu, navOpenKeys, userPower, changeOpenKeys }) {
  const topMenus = menu.map(item => item.key)

  const getMenus = (menuArray, isSiderFold, parentPath = '/') => {
    return menuArray.map((item) => {
      const linkTo = parentPath + item.key
      const query = item.query ? `?${stringify(item.query)}` : ''
      if (item.children) {
        return (
          <Menu.SubMenu key={linkTo} title={<span>{item.icon ? <Icon type={item.icon} /> : ''}{isSiderFold && topMenus.indexOf(item.key) >= 0 ? '' : item.name}</span>}>
            {getMenus(item.children, isSiderFold, `${linkTo}/`)}
          </Menu.SubMenu>
        )
      }
      return (
        <Menu.Item key={linkTo}>
          {!item.outLink &&
            <Link to={`${linkTo}${query}`}>
              {item.icon ? <Icon type={item.icon} /> : ''}
              {isSiderFold && topMenus.indexOf(item.key) >= 0 ? '' : item.name}
            </Link>
          }
          {item.outLink &&
            <a target="_blank" onClick={() => renderOutLink(item.outLink())}>
              {item.icon ? <Icon type={item.icon} /> : ''}
              {isSiderFold && topMenus.indexOf(item.key) >= 0 ? '' : item.name}
            </a>
          }
        </Menu.Item>
      )
    })
  }

  const getMenusByPower = (menuArray) => {
    return menuArray.reduce((array, item) => {
      if (!userPower[item.id] || !item.power.find(cur => cur === 1)) {
        return array
      }
      const hasPower = !!userPower[item.id].find(cur => cur === 1) // cur == 1：菜单查看权限
      if (item.children) {
        if (hasPower) {
          item.children = getMenusByPower(item.children)
          array.push(item)
        }
      } else {
        hasPower && array.push(item)
      }
      return array
    }, [])
  }

  const menuPower = getMenusByPower(immutableMenu.toJS())

  const menuItems = getMenus(menuPower, siderFold)

  const getAncestorKeys = (key) => {
    const map = {
      // navChildParent: ['navParent'],
      '/navigation/navigation2': ['/navigation'],
    }
    return map[key] || []
  }

  const onOpenChange = (openKeys) => {
    const latestOpenKey = openKeys.find(key => !(navOpenKeys.indexOf(key) > -1))
    const latestCloseKey = navOpenKeys.find(key => !(openKeys.indexOf(key) > -1))

    let nextOpenKeys = []
    if (latestOpenKey) {
      nextOpenKeys = getAncestorKeys(latestOpenKey).concat(latestOpenKey)
    }
    if (latestCloseKey) {
      nextOpenKeys = getAncestorKeys(latestCloseKey)
    }
    changeOpenKeys(nextOpenKeys)
  }

  // 菜单栏收起时，不能操作openKeys
  let menuProps = !siderFold ? {
    onOpenChange,
    openKeys: navOpenKeys,
  } : {}

  return (
    <QueueAnim delay={400} type="left">
      <Menu
        key="1"
        {...menuProps}
        mode={siderFold ? 'vertical' : 'inline'}
        theme={darkTheme ? 'dark' : 'light'}
        onClick={handleClickNavMenu}
        defaultSelectedKeys={[location.pathname !== '/' ? location.pathname : '/dashboard']}
      >
        {menuItems}
      </Menu>
    </QueueAnim>
  )
}

Menus.propTypes = {
  menu: PropTypes.array,
  siderFold: PropTypes.bool,
  darkTheme: PropTypes.bool,
  handleClickNavMenu: PropTypes.func,
  navOpenKeys: PropTypes.array,
  changeOpenKeys: PropTypes.func,
  location: PropTypes.object,
  userPower: PropTypes.object,
}

export default Menus
