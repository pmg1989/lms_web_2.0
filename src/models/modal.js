
export default {
  namespace: 'modal',
  state: {
    id: 1, // 当前弹框的ID号，当弹框数量多于一个时可以通过ID切换各个窗口
    visible: false,
    type: 'create',
    curItem: {},
  },
  reducers: {
    showModal (state, action) {
      const { id = 1 } = action.payload
      return { ...state, visible: true, ...action.payload, id }
    },
    hideModal (state) {
      return { ...state, visible: false, curItem: {} }
    },
    setItem (state, action) {
      const { curItem, id = 1 } = action.payload
      return { ...state, curItem, id }
    },
  },
}
