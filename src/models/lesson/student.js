import { message } from 'antd'
import { query, attendance, queryComment, comment, queryFeedback } from 'services/lesson/student'
import { unenrollesson } from 'services/lesson/item'

export default {
  namespace: 'lessonStudent',
  state: {
    list: [],
  },

  subscriptions: {
  },

  effects: {
    * query ({ payload }, { call, put }) {
      const { lessonid } = payload
      const { data, success } = yield call(query, { lessonid })
      if (success) {
        yield put({
          type: 'querySuccess',
          payload: { list: data },
        })
      }
    },
    * attendance ({ payload }, { call }) {
      const { params } = payload
      const { success } = yield call(attendance, params)
      if (!success) {
        message.error('对不起，考勤失败！')
      }
    },
    * remove ({ payload }, { call, put }) {
      const { params } = payload
      const { success } = yield call(unenrollesson, params)
      if (success) {
        yield put({
          type: 'removeSuccess',
          payload: { id: params.userid },
        })
      }
    },
    * showCommentModal ({ payload }, { call, put }) {
      const { type, params } = payload
      yield put({ type: 'modal/showModal', payload: { type, id: 1 } })
      if (type !== 'create') {
        const { data, success } = yield call(queryComment, params)
        if (success) {
          yield put({ type: 'modal/setItem', payload: { id: 1, curItem: { ...data.commenttext.suggestion, userid: params.userid } } })
        }
      }
    },
    * comment ({ payload }, { call, put }) {
      const { params } = payload
      const { success } = yield call(comment, params)
      if (success) {
        message.success('评价成功！')
        yield put({
          type: 'commentSuccess',
          payload: { id: params.userid },
        })
        yield put({ type: 'modal/hideModal' })
      }
    },
    * showRecordModal ({ payload }, { call, put }) {
      const { type, params } = payload
      const { data, success } = yield call(queryComment, params)
      if (success) {
        yield put({ type: 'modal/showModal', payload: { type, curItem: data, id: 2 } })
      }
    },
    * showFeedbackModal ({ payload }, { call, put }) {
      const { type, params } = payload
      yield put({ type: 'modal/showModal', payload: { type, id: 3 } })
      const { data, success } = yield call(queryFeedback, params)
      if (success) {
        yield put({ type: 'modal/setItem', payload: { id: 3, curItem: { ...data.onlinetext.weekly, userid: params.userid } } })
      }
    },
  },

  reducers: {
    querySuccess (state, action) {
      return { ...state, ...action.payload }
    },
    removeSuccess (state, action) {
      const list = state.list.filter(item => item.id !== action.payload.id)
      return { ...state, list }
    },
    commentSuccess (state, action) {
      const list = state.list.map(item => (item.id === action.payload.id ? ({ ...item, gradetime: new Date().getTime() }) : item))
      return { ...state, list }
    },
  },
}
