// ---------------------控制点击事件频率-----------------------
const throttle = (fn, gapTime) => {
  // 默认设置为网络超时时间
  gapTime = gapTime || 10000
  let _lastTime = null

  return function () {
    let _nowTime = new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments)
      _lastTime = _nowTime
    }
  }
}
// ---------------------构造url参数-----------------------
const genUrlParams = params => {
  let str = '';
  for(let key in params) {
    params[key] = encodeURIComponent(params[key]);
    str += `&${key}=${params[key]}`;
  }
  return str.slice(1);
}
// ----------------------验证数据格式--------------------------
const verifyPhone = phone => {
  // 只校验基本的格式，以1开头的11位数字
  let re = /^1\d{10}$/
  if (!re.test(phone)) {
    return false
  }
  return true
}

module.exports = {
  throttle: throttle,
  genUrlParams: genUrlParams,
  verifyPhone: verifyPhone
}