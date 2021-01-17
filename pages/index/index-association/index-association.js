// pages/index/index-association/index-association.js
const app = getApp()
const comm=require("../../../utils/request")
const util=require("../../../utils/util")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mylist:[],//我关注的社团
    list:[],//社团列表
    countnum:null,//总共社团数
    tip_key:1,
    loading:true,  //骨架屏
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(wx.getStorageSync('userId'))
    this.getass();
  },
  getass:function(){

    var data = {
      uid:wx.getStorageSync('userId')
    },url = 'association/Association/getass',
    message = '',method = 'get',that = this;
    comm.requestAjax(url,data,message,method,function(res){
      console.log(res)
      if(res.mylist.length==0)
      {
        that.data.tip_key=0;
      }
      that.setData({
        mylist:res.mylist,
        list:res.allassociation,
        countnum:res.countnum,
        tip_key:that.data.tip_key,
        loading:false,
      })
    },
    function (res){
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