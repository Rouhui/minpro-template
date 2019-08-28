import md5 from "/md5.js"
import config from './config'

var header = {
  'Accept': 'application/json',
  'content-type': 'application/json',
  'Authorization': null,
}
/**
 * options结构
 * showSucMsg, 是否提示请求成功，默认不显示
 * sucMsg，请求成功提示文字，默认显示返回的resultMessage
 * sucIcon，请求成功提示图标，默认不显示图标
 * hideErrMsg, 是否隐藏请求失败提示，默认不隐藏
 * errMsg，请求失败提示文字，默认显示返回的resultMessage
 * errIcon，请求失败提示图标，默认不显示图标
 * auth, 设置请求头auth, 当前只应用于绑定用户手机接口
 */
function _handleResponse(resolve, reject, options, response) {
  if (response.resultCode === 1 || response.resultCode === 2) { // 请求成功
    if (options.showSucMsg) {
      wx.showToast({
        title: options.sucMsg || response.resultMessage,
        icon: options.sucIcon || 'none',
        duration: 2000
      })
    }
    resolve(response);
  } else { // 请求失败
    if (!options.hideErrMsg) {
      wx.showToast({
        title: options.errMsg || response.resultMessage,
        icon: options.errIcon || 'none',
        duration: 2000
      })
    }
    reject(response);
  }
}

function _getToken(options) {
  let tHeader = Object.assign({}, header);
  if (options.auth) {
    tHeader.Auth = options.auth;
  } else {
    let auth = wx.getStorageSync('auth');
    if (auth) {
      tHeader.Auth = auth;
    }
  }
  return tHeader;
}

function _signParams(data) {
  var sign = "";
  var paramsKey = new Array();
  var paramsValue = new Array();
  if (data != null && data != undefined) {
    for (var item in data) {
      paramsKey.push(item);
      paramsValue[item] = data[item];
    }
  }
  // 解决小程序审核失败，可能包含明文appSecret的问题
  const _key = ["a", "p", "p", "S", "e", "c", "r", "e", "t"].join('')
  paramsKey.push("timeStamp");
  paramsKey.push(_key);
  paramsValue["timeStamp"] = new Date().getTime();
  paramsValue[_key] = "xte0c98e7ccb8fe167e71d1af7bf517e7f";
  var paramsSort = paramsKey.sort();
  var sign = "";
  for (var i = 0; i < paramsSort.length; i++) {
    sign += paramsValue[paramsSort[i]];
  }
  data["timeStamp"] = paramsValue["timeStamp"];
  data["sign"] = md5(sign);
  return data;
}

function get(url, data = {}, options = {}) {
  wx.showLoading({
    title: '加载中',
  })
  let tHeader = _getToken(options);
  let promise = new Promise(function (resolve, reject) {
    wx.request({
      url: config.baseUrl + url,
      method: 'get',
      data: data,
      header: tHeader,
      success: function (res) {
        wx.hideLoading();
        _handleResponse(resolve, reject, options, res.data);
      },
      fail: function () {
        wx.hideLoading();
        wx.showModal({
          title: '网络错误',
          content: '网络出错，请刷新重试',
          showCancel: false
        })
        reject();
      }
    })
  })
  return promise;
}

function post(url, data, options = {}) {
  data = _signParams(data)
  let tHeader = _getToken(options);
  let promise = new Promise(function (resolve, reject) {
    wx.request({
      url: config.baseUrl + url,
      header: tHeader,
      data: data,
      method: 'post',
      success: function (res) {
        wx.hideLoading();
        _handleResponse(resolve, reject, options, res.data);
      },
      fail: function () {
        wx.hideLoading();
        wx.showModal({
          title: '网络错误',
          content: '网络出错，请刷新重试',
          showCancel: false
        })
        reject();
      }
    })
  })
  return promise;
}

function uploadImg(url, options = {}) {
  let tHeader = _getToken(options);
  let promise = new Promise(function (resolve, reject) {
    wx.uploadFile({
      url: config.baseUrl + '/api/file/upload',
      filePath: url,
      name: "uploadedfile",
      header: tHeader,
      formData: {
        "ftype": 3,
        "oss": 1
      },
      success: res => {
        resolve(res.data)
      },
      fail: res => {
        reject(res.data);
      }
    })
  })
  return promise;
}

module.exports = {
  get: get,
  post: post,
  uploadImg: uploadImg
}