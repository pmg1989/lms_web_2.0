import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Tabs } from 'antd'
import ListTeacher from './Teacher/List'
import SearchTeacher from './Teacher/Search'

const TabPane = Tabs.TabPane

const namespace = 'analysisReport'

function Report ({ dispatch, analysisReport, loading, commonModel }) {
  const searchProps = {
    schools: commonModel.schools,
    onSearch (fieldsValue) {
      dispatch({
        type: `${namespace}/queryTeacherReport`,
        payload: { current: 1, ...fieldsValue },
      })
    },
  }

  const listProps = {
    teacher: analysisReport.teacher,
    loading: loading.effects[`${namespace}/queryTeacherReport`],
    onPageChange (fieldsValue) {
      dispatch({
        type: `${namespace}/queryTeacherReport`,
        payload: { ...fieldsValue, isPostBack: false },
      })
    },
  }

  const handleTabChange = (key) => {
    console.log(key)
  }

  return (
    <div className="content-inner">
      <Tabs defaultActiveKey="1" onChange={handleTabChange}>
        <TabPane tab="老师课时统计月报表" key="1">
          <SearchTeacher {...searchProps} />
          <ListTeacher {...listProps} />
        </TabPane>
        <TabPane tab="进行中的学生消课率统计" key="2">
          <SearchTeacher {...searchProps} />
          <ListTeacher {...listProps} />
        </TabPane>
        <TabPane tab="专业课老师开课中的合同报表" key="3">
          <SearchTeacher {...searchProps} />
          <ListTeacher {...listProps} />
        </TabPane>
      </Tabs>
      
    </div>
  )
}

Report.propTypes = {
  dispatch: PropTypes.func,
  curPowers: PropTypes.array,
  analysisReport: PropTypes.object,
  loading: PropTypes.object.isRequired,
  commonModel: PropTypes.object.isRequired,
}

function mapStateToProps ({ analysisReport, loading, commonModel }) {
  return { analysisReport, loading, commonModel }
}

export default connect(mapStateToProps)(Report)
