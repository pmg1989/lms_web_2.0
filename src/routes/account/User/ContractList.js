import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Tabs, Icon } from 'antd'

const TabPane = Tabs.TabPane

class ContractList extends Component {
  static propTypes = {
    contractList: PropTypes.object.isRequired,
  }

  state = {
    visible: false,
    confirmLoading: false,
  }

  render () {
    const { contractList } = this.props
    const { visible, confirmLoading } = this.state
    console.log(visible, confirmLoading, contractList)
    return (
      <Tabs defaultActiveKey="1" size="small">
        <TabPane tab={<span><Icon type="clock-circle-o" />正在学习</span>} key="1">Content of tab 1</TabPane>
        <TabPane tab={<span><Icon type="question-circle-o" />待开课</span>} key="2">Content of tab 2</TabPane>
        <TabPane tab={<span><Icon type="check-circle-o" /> 已结课</span>} key="3">Content of tab 3</TabPane>
      </Tabs>
    )
  }
}

export default ContractList
