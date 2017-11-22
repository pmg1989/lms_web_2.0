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
  theory: '乐理',
  piano: '键盘',
  guitar: '吉他',
  eguitar: '电吉他',
  composition: '作曲',
  record: '录音',
  rhythm: '节奏',
  yoga: '瑜伽',
}

export function getSubject (subject = '') {
  return subjects[subject.toLowerCase()] || '未知'
}

export const roleNames = {
  admin: '管理员',
  teacher: '老师',
  courseCreator: '校长',
  hr: 'HR专员',
  specialist: '课程专家',
}

export function getRoleName (role = '') {
  return subjects[role.toLowerCase()] || '未知'
}
