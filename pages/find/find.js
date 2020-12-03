// pages/find/find.js
// 引入request封装
const comm = require("../../utils/request.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    list:[],
  },
  //测试请求分页数据-thinkPHP后台，社团协会资讯数据
  ok:function(e){
    var temppage = {
      page:this.data.page
    },that = this;
    console.log("进来的page"+temppage.page)
    comm.requestAjax("association/Information/getnewinfor",temppage,"请求更多…","get",
    function(res){
      var a=that.data.list;
      var temp=a.concat(res.data)
      that.setData({
        page:Number(res.current_page)+1,
        list:temp
      })
      console.log(res)
      console.log(that.data.page)
    },
    function(res){
      wx.showToast({ title: '授权失败', icon: 'none' });
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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