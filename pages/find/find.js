// pages/find/find.js
// 引入request封装
const comm = require("../../utils/request.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value:'',
    statusBarHeight:app.globalData.statusBarHeight
  },
  //测试请求分页数据-thinkPHP后台，社团协会资讯数据
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  activeNav(e) {
    this.setData({
      currentIndex: e.currentTarget.dataset.index,
      navScrollLeft: e.detail.current >= 5 ? ((e.detail.current) * 80) : 0
    })
  },
  changeTab(e){
    this.setData({
      currentIndex: e.detail.current,
      navScrollLeft: e.detail.current>=5?((e.detail.current) * 80):0
    })
  },
  onChange(e) {
    this.setData({
      value: e.detail,
    });
  },
  onSearch() {
    Toast('搜索' + this.data.value);
  },
  onClick() {
    Toast('搜索' + this.data.value);
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