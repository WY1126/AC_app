//app.js
// const comm = require('./utils/request')
App({
  data:{
    ishomered:false, //home底部栏是否显示小红点
    iswarnred:false,  //home页消息栏是否显示小红点,
    to_uid:12,
  },
  onLaunch: function () {
    const that = this;
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    // 胶囊按钮位置信息
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    // 导航栏高度 = 状态栏到胶囊的间距（胶囊距上距离-状态栏高度） * 2 + 胶囊高度 + 状态栏高度
    that.globalData.navBarHeight = (menuButtonInfo.top - systemInfo.statusBarHeight) * 2 + menuButtonInfo.height + systemInfo.statusBarHeight;
    that.globalData.menuRight = systemInfo.screenWidth - menuButtonInfo.right;
    that.globalData.menuBotton = menuButtonInfo.top - systemInfo.statusBarHeight;
    that.globalData.menuHeight = menuButtonInfo.height;

    //获取导航栏高度
    wx.getSystemInfo({
      success: function (res) {
          that.globalData.statusBarHeight = res.statusBarHeight
       }
    })
    wx.request({
      url: that.globalData.requestUrl+'home/Notify/scannotify',
      data:{
        to_uid:that.data.to_uid
      },
      method:'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success(res){
        console.log(res)

          wx.setStorageSync('notifyList', res.data)
          wx.showTabBarRedDot({
            index: 2,
          })
          that.globalData.isHomeWarnRed = true;
      },
      fail(){
        console.log('扫描信息失败！')
      }
    })
    //循环扫描
    // var scannotify = setInterval(function(){
    //   that.scannotify()
    // },2000)


  
    // // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })
    // // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },
  scannotify:function(){
    console.log('scaning……')
    var uid = wx.getStorageSync('userId'), that =this,
    url = this.globalData.requestUrl;
    // comm.requestAjax(url,{uid:12},'','get',function(res) {
    //   console.log(res)
    // },function (res) {
    //   console.log('shibai')
    // })
    wx.request({
      url: url+'home/Notify/scannotify',
      data:{
        to_uid:that.data.to_uid
      },
      method:'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success(res){
        
        if(res.data.length>wx.getStorageSync('notifyList').length)//大于本地消息列表说明有新消息
        {
          wx.setStorageSync('notifyList', res.data)
          that.globalData.isHomeWarnRed = true
          console.log(res)
        }
      },

      fail(){
        console.log('扫描信息失败！')
      },
      complete(){
        // wx.hideToast({
        //   success: (res) => {},
        // })
      }
    })
    // console.log(wx.getStorageSync('userId'))
  },
  globalData: {
    isHomeTabbarRed:false,  //我的底部导航栏显示红点
    isHomeWarnRed:false,    //我的页是否又新消息
    userId:0,
    userInfo: null,
    navBarHeight: 0, // 导航栏高度
    menuRight: 0, // 胶囊距右方间距（方保持左、右间距一致）
    menuBotton: 0, // 胶囊距底部间距（保持底部间距一致）
    menuHeight: 0, // 胶囊高度（自定义内容可与胶囊高度保证一致）
    statusBarHeight:0,//导航栏高度
    avatarurlhead:"http://acimages-1302835316.cos.ap-shanghai.myqcloud.com/",   //图片根地址头
    requestUrl:"http://150.158.156.31/AC_tp/public/",                     //请求根地址
    URL:"150.158.156.31",   //公网地址
    cosUrl:'http://acimages-1302835316.cos.ap-shanghai.myqcloud.com/', //对象存储头地址
    // avatarurlhead:"http://127.0.0.1/AC_tp/uploads/",   //图片根地址头
    // requestUrl:"http://127.0.0.1/AC_tp/public/",        //请求根地址
    // URL:"127.0.0.1",
    tabbarwords:['二手货','失物','组队','圈子','好物分享','回家平台','公告','其他','广告'],
  }  
})