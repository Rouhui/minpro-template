import md5 from "/md5.js"
import {
  baseUrl
} from './config'

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
  if (response.resultCode === 1 || response.resultCode === 2 || (response.resultCode > 16 && response.resultCode < 21)) { // 请求成功
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
    let user = wx.getStorageSync('user');
    if (user) {
      user = JSON.parse(user) || {};
      if (user.auth) {
        tHeader.Auth = user.auth;
      };
    }
  }
  return tHeader;
}

function getReq(url, options = {}) {
  wx.showLoading({
    title: '加载中',
  })
  let tHeader = _getToken(options);
  let promise = new Promise(function (resolve, reject) {
    wx.request({
      url: baseUrl + url,
      method: 'get',
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

function postReq(url, data, options = {}) {
  data = md5.SignParams(data)
  let tHeader = _getToken(options);
  let promise = new Promise(function (resolve, reject) {
    wx.request({
      url: baseUrl + url,
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
      url: baseUrl + '/api/file/upload',
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
  getReq: getReq,
  postReq: postReq,
  uploadImg: uploadImg
}