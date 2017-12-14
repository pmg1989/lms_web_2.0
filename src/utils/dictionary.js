export const categorys = {
  profession: '专业课',
  hd: '互动课',
  jl: '交流课',
}

export function getCategory (category = '') {
  return categorys[category.toLowerCase()] || '未知'
}

export const subjects = {
  vocal: '声乐',
  piano: '键盘',
  guitar: '吉他',
  eguitar: '电吉他',
  yoga: '瑜伽',
  rhythm: '节奏',
  record: '录音',
  theory: '乐理',
  composition: '流行音乐创作实践',
}

export function getSubject (subject = '') {
  return subjects[subject.toLowerCase()] || '未知'
}

export const roleNames = {
  admin: '管理员',
  teacher: '老师',
  coursecreator: '校长',
  hr: 'HR专员',
  specialist: '课程专家',
}

export function getRoleName (rolename = '') {
  return roleNames[rolename.toLowerCase()] || '未知'
}

export function getModalType (type) {
  return {
    create: { name: '新建', icon: 'plus-circle-o' },
    update: { name: '修改', icon: 'edit' },
    detail: { name: '查看', icon: 'exclamation-circle-o' },
  }[type.toLowerCase()] || '未知'
}
