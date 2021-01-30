// pages/user/user.js
const app = getApp();
const comm = require('../../utils/request')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl:null,
    nickname:null,
    wornkey:false,
    notifylist:[],  //消息列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log(app.globalData.isHomeWarnRed)
    console.log('ds')
    var userinfor = wx.getStorageSync('userinfo'),that = this;
    // console.log(wx.getStorageSync('userinfo'))
    this.setData({
      avatarUrl:userinfor.avatar,
      nickname:userinfor.nickname,
      wornkey:app.globalData.isHomeWarnRed,
      
    })
    wx.hideTabBarRedDot({
      index: 2,
    })
  },
  tonotify:function (){
    this.setData({
      wornkey:false
    })
    // app.globalData.isHomeWarnRed = false
    wx.navigateTo({
      url: './notify/notify',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})