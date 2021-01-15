// pages/index/index-news/index-news.js
const comm = require('../../../utils/request')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newsinfor:null,
    list:null,
    active: 0,
  },
  tonewsdel:function(e){
    // console.log(e.currentTarget.dataset.newsurl)
    wx.navigateTo({
      url: '../index-news-del/index-news-del?url='+e.currentTarget.dataset.newsurl,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getnews();
  },
  getnews:function (){
    var that = this;
    comm.requestAjax('news/News/getnews','','请求中…','get',function(res){
      console.log(res);
      // that.data.list = res[73];
      that.setData({
        list:res[0],
        newsinfor:res
      })
      console.log(that.data.list)
    },
    function (res){
      wx.showToast({
        title: '请求失败',
      })
    })
  },
  onChange(event) {
    wx.showToast({
      title: `切换到标签 ${event.detail.name}`,
      icon: 'none',
    });
    var i = event.detail.name
    console.log(event.detail.name)
    
    this.setData({
      list:this.data.newsinfor[i]
    })
    console.log(this.data.newsinfor[i])
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