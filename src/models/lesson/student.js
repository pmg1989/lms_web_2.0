import { message } from 'antd'
import { query, attendance, queryComment, comment, queryFeedback, uploadRecord, uploadSong } from 'services/lesson/student'
import { enrollesson, unenrollesson } from 'services/lesson/item'

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
    * attendance ({ payload }, { call, put }) {
      const { params } = payload
      const { success } = yield call(attendance, params)
      if (success) {
        yield put({
          type: 'attendanceSuccess',
          payload: { id: params.userid, acronym: params.status },
        })
      }
    },
    * addStudent ({ payload }, { call, put }) {
      const { params } = payload
      const { success } = yield call(enrollesson, { ...params, rolename: 'student' })
      if (success) {
        yield put({
          type: 'query',
          payload: { lessonid: params.lessonid },
        })
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
      yield put({ type: 'modal/showModal', payload: { type, id: 1, curItem: { userid: params.userid } } })
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
        yield put({
          type: 'lessonItem/query',
          payload: { lessonid: params.lessonid },
        })
        yield put({ type: 'modal/hideModal' })
      }
    },
    * showRecordModal ({ payload }, { put }) {
      const { type, curItem } = payload
      yield put({ type: 'modal/showModal', payload: { type, curItem, id: 2 } })
    },
    * updateSong ({ payload }, { call, put }) {
      const { params } = payload
      const { success } = yield call(uploadSong, params)
      if (success) {
        yield put({ type: 'modal/hideModal' })
        yield put({
          type: 'updateSongSuccess',
          payload: params,
        })
      }
    },
    * uploadRecord ({ payload }, { call, put }) {
      const { params } = payload
      const { data, success } = yield call(uploadRecord, params)
      if (success) {
        yield put({
          type: 'uploadSuccess',
          payload: {
            jlRecording: data,
            id: params.studentid,
          },
        })
        yield put({ type: 'modal/hideModal' })
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
    attendanceSuccess (state, action) {
      const { id, acronym } = action.payload
      const list = state.list.map(item => (item.id === id ? { ...item, acronym } : item))
      return { ...state, list }
    },
    removeSuccess (state, action) {
      const list = state.list.filter(item => item.id !== action.payload.id)
      return { ...state, list }
    },
    commentSuccess (state, action) {
      const list = state.list.map(item => (item.id === action.payload.id ? ({ ...item, gradetime: new Date().getTime() }) : item))
      return { ...state, list }
    },
    uploadSuccess (state, action) {
      const { jlRecording, id } = action.payload
      const list = state.list.map(item => (item.id === id ? { ...item, jl_recording: jlRecording } : item))
      return { ...state, list }
    },
    updateSongSuccess (state, action) {
      const { userid, song, original_singer: originalSinger } = action.payload
      const list = state.list.map(item => (item.id === userid ? { ...item, jl_song: { ...item.jl_song, song, original_singer: originalSinger } } : item))
      return { ...state, list }
    },
    resetStudents (state) {
      return { ...state, list: [] }
    },
  },
}
