
export function validPhone (rule, value, callback) {
  if (!!value && !(/^1(3|4|5|7|8)\d{9}$/.test(value))) {
    callback('手机号码格式不正确')
  } else {
    callback()
  }
}

export function validPassword (rule, value, callback) {
  if (!!value && !(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!#^%*?&])[A-Za-z\d$@$!#^%*?&]{8,}$/.test(value))) {
    callback('密码至少八个字符，至少一个大写字母，一个小写字母，一个数字和一个特殊字符, 例如 @$!#^%*?&')
  } else {
    callback()
  }
}
