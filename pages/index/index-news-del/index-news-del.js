// pages/index/index-news-del/index-news-del.js
const comm = require('../../../utils/request'); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newsinfo:[],//文章内容
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log('sasaas')
    console.log(options.url)
    var that = this,data={
      rurl:options.url 
    };
    comm.requestAjax('news/News/getnewscontent',data,'请求中…','get',function(res){
      console.log(res)
      that.setData({
        newsinfo:res
      })
      console.log(that.data.newsinfo.create_time)
    },function(res){
      wx.showToast({
        title: '请求失败',
      })
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