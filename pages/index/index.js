//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    TabCur: 0,
    scrollLeft:0
  },
  onLoad: function () {
    //如果缓存中没有openID
    var openID = wx.getStorageSync('openid')
    if(openID===null) {
      wx.redirectTo({
        url: '/pages/user/signup/signup',
      })
    }
    console.log(openID)
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id-1)*60
    })
  },
})