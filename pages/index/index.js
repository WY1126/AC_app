//index.js
//获取应用实例
const app = getApp()
const comm=require("../../utils/request")
Page({
  data: {
    TabCur: 0,
    scrollLeft:0,
    active: 1,
    page:1,
    list:[],
  },
  //获取5条社团资讯数据
  getinfor:function(){
    var temppage = {
      page:this.data.page
    },that = this;
    console.log("进来的page"+temppage.page)
    comm.requestAjax("association/Information/getnewinfor",temppage,"请求更多…","get",
    function(res){
      if(res.error_code===0)
      {
        wx.showToast({ title: '没有更多', icon: 'none' });
      }else{
              var a=that.data.list;
      var temp=a.concat(res.data)
      that.setData({
        page:Number(res.current_page)+1,
        list:temp
      })
      console.log(res)
      console.log(that.data.page)
      }
    },
    function(res){
      wx.showToast({ title: '请求失败!', icon: 'none' });
    })
  },
  onLoad: function () {
    //如果缓存中没有openID
    var openID = wx.getStorageSync('openid')
    // console.log(openID)
    if(openID==="") {
      wx.redirectTo({
        url: '/pages/user/signup/signup',
      })
    }
    this.getinfor()
    
  },
    /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getinfor()
  },

  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id-1)*60
    })
  },
  onChange(event) {
    wx.showToast({
      title: `切换到标签 ${event.detail.name}`,
      icon: 'none',
    });
  },
})