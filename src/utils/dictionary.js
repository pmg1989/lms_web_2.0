export function getCategory (type) {
  return {
    profession: '专业课',
    hd: '互动课',
    jl: '交流课',
  }[type.toLowerCase()] || '未知'
}

export function getSubject (type) {
  return {
    vocal: '声乐',
    theory: '乐理',
    piano: '键盘',
    guitar: '吉他',
    eguitar: '电吉他',
    composition: '作曲',
  }[type.toLowerCase()] || '未知'
}
