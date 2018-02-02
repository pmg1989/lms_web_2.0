import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Tabs } from 'antd'
import ListTeacher from './Teacher/List'
import SearchTeacher from './Teacher/Search'
import ListLessonComplete from './LessonComplete/List'
import SearchLessonComplete from './LessonComplete/Search'
import ListProTeacher from './ProTeacher/List'
import SearchProTeacher from './ProTeacher/Search'

const TabPane = Tabs.TabPane

const namespace = 'analysisReport'

class Report extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    curPowers: PropTypes.array,
    analysisReport: PropTypes.object,
    loading: PropTypes.object.isRequired,
    commonModel: PropTypes.object.isRequired,
  }

  state = {
    tab1: false,
    tab2: false,
    tab3: false,
  }

  handleTabChange = (tab) => {
    const { dispatch, analysisReport: { lessonComplete, proTeacher } } = this.props
    if (!this.state[tab]) {
      if (tab === 'tab2') {
        dispatch({
          type: `${namespace}/queryLessonCompleteReport`,
          payload: lessonComplete.searchQuery,
        })
      } else if (tab === 'tab3') {
        dispatch({
          type: `${namespace}/queryProTeacherReport`,
          payload: proTeacher.searchQuery,
        })
      }
      this.setState({ [tab]: true })
    }
  }

  render () {
    const { dispatch, analysisReport, loading, commonModel } = this.props

    const searchTeacherProps = {
      schools: commonModel.schools,
      onSearch (fieldsValue) {
        dispatch({
          type: `${namespace}/queryTeacherReport`,
          payload: { current: 1, ...fieldsValue },
        })
      },
      onExport (fieldsValue) {
        dispatch({
          type: `${namespace}/exportTeacherReport`,
          payload: fieldsValue,
        })
      },
    }

    const listTeacherProps = {
      teacher: analysisReport.teacher,
      loading: loading.effects[`${namespace}/queryTeacherReport`],
      onPageChange (fieldsValue) {
        dispatch({
          type: `${namespace}/queryTeacherReport`,
          payload: { ...fieldsValue, isPostBack: false },
        })
      },
    }

    const searchLessonCompleteProps = {
      schools: commonModel.schools,
      onSearch (fieldsValue) {
        dispatch({
          type: `${namespace}/queryLessonCompleteReport`,
          payload: { current: 1, ...fieldsValue },
        })
      },
      onExport (fieldsValue) {
        dispatch({
          type: `${namespace}/exportLessonCompleteReport`,
          payload: fieldsValue,
        })
      },
    }

    const listLessonCompleteProps = {
      lessonComplete: analysisReport.lessonComplete,
      loading: loading.effects[`${namespace}/queryLessonCompleteReport`],
      onPageChange (fieldsValue) {
        dispatch({
          type: `${namespace}/queryLessonCompleteReport`,
          payload: { ...fieldsValue, isPostBack: false },
        })
      },
    }

    const searchProTeacherProps = {
      schools: commonModel.schools,
      onSearch (fieldsValue) {
        dispatch({
          type: `${namespace}/queryProTeacherReport`,
          payload: { current: 1, ...fieldsValue },
        })
      },
      onExport (fieldsValue) {
        dispatch({
          type: `${namespace}/exportProTeacherReport`,
          payload: fieldsValue,
        })
      },
    }

    const listProTeacherProps = {
      proTeacher: analysisReport.proTeacher,
      loading: loading.effects[`${namespace}/queryProTeacherReport`],
      onPageChange (fieldsValue) {
        dispatch({
          type: `${namespace}/queryProTeacherReport`,
          payload: { ...fieldsValue, isPostBack: false },
        })
      },
    }

    return (
      <div className="content-inner">
        <Tabs defaultActiveKey="tab1" onChange={this.handleTabChange}>
          <TabPane tab="老师课时统计月报表" key="tab1">
            <SearchTeacher {...searchTeacherProps} />
            <ListTeacher {...listTeacherProps} />
          </TabPane>
          <TabPane tab="进行中的学生消课率统计" key="tab2">
            <SearchLessonComplete {...searchLessonCompleteProps} />
            <ListLessonComplete {...listLessonCompleteProps} />
          </TabPane>
          <TabPane tab="专业课老师开课中的合同报表" key="tab3">
            <SearchProTeacher {...searchProTeacherProps} />
            <ListProTeacher {...listProTeacherProps} />
          </TabPane>
        </Tabs>

      </div>
    )
  }
}

function mapStateToProps ({ analysisReport, loading, commonModel }) {
  return { analysisReport, loading, commonModel }
}

export default connect(mapStateToProps)(Report)
