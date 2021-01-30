const util = require('../../../utils/util');
// pages/user/notify/notify.js
// const util = require('../../../utils/util') 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    notifyList:null,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var notifyList = wx.getStorageSync('notifyList'),
    notify;
    
    for(var i=0;i<notifyList.length;i++){
      notify = notifyList[i]
      notify.create_time = util.getDiffTime(notify.create_time,true);
    }
    this.setData({
      notifyList:notifyList
    })
    console.log(this.data.notifyList)
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