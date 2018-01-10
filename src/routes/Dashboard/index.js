import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Col, Row } from 'antd'
import ComingLessons from './ComingLessons'
import TeacherStatInfo from './TeacherStatInfo'

const roles = ['admin', 'coursecreator', 'teacher']

const namespace = 'dashboard'

function Dashboard ({ dashboard, loading, user: { rolename } }) {
  const comingLessonsProps = {
    list: dashboard.comingLessons,
    loading: loading.effects[`${namespace}/queryComingLessons`],
  }

  const teacherStatInfoProps = {
    item: dashboard.teacherStatInfo,
    loading: loading.effects[`${namespace}/queryTeacherStatInfo`],
  }

  return (
    <div className="content-inner">
      {roles.includes(rolename) &&
        <Row gutter={20} style={{ minWidth: 700 }}>
          <Col span={16}>
            <ComingLessons {...comingLessonsProps} />
          </Col>
          {rolename === 'teacher' &&
          <Col span={8}>
            <TeacherStatInfo {...teacherStatInfoProps} />
          </Col>
          }
        </Row>
      }
    </div>
  )
}

Dashboard.propTypes = {
  dashboard: PropTypes.object.isRequired,
  loading: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
}

function mapStateToProps ({ dashboard, loading, app: { user } }) {
  return { dashboard, loading, user }
}

export default connect(mapStateToProps)(Dashboard)
