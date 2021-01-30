// pages/index/index-news-del/index-news-del.js
const comm = require('../../../utils/request'); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newsinfo:[],//文章内容
    send_key:0,//发送按钮的显示key
    htmlcon:'',
    window_width:300,
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
      //匹配以src='/开头替换为src="https://www.jxutcm.edu.cn/   
      that.data.htmlcon = res.content.replace(/src="\//g,'src="https://www.jxutcm.edu.cn/');
      that.data.htmlcon = that.data.htmlcon.replace(/width="[0-9][0-9][0-9]"/g,'width="'+(that.data.window_width-20)+'"')
      that.setData({
        htmlcon:that.data.htmlcon
      })
      console.log(that.data.htmlcon)
      that.setData({
        newsinfo:res,
        send_key:1,
      })
      console.log(that.data.newsinfo.create_time)
    },function(res){
      wx.showToast({
        title: '请求失败',
      })
    })
  },

    
  onShareAppMessage: function () {
    return {
      title: '微诊断',
      path: '/pages/index/index-news-del'
    }
  },
  /**
* 生命周期函数--监听页面初次渲染完成
*/
onReady: function () {
  var that = this;
  wx.getSystemInfo({
    success: function (res) {
      //获取屏幕窗口高度和宽度
      that.data.window_heigt = res.windowHeight
      that.data.window_width = res.windowWidth
    },
  })
 },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showShareMenu({
      withShareTicket: true,
      menus:['shareAppMessage', 'shareTimeline']
    })
    
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