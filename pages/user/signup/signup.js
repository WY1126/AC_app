const comm=require('../../../utils/request.js')
var app = getApp();
Page({
	data:{
    loading:false,
  },
	onLoad(){
		// let dataList={userId:'1',name:'张三'}
		// comm.requestAjax('index/index/getme',dataList,'正在加载',function(res){
		// 	console.log(res)//请求成功回调
		// },function(res){
		// 	console.log(res)//请求失败回调
		// });
  },
  handleGetUserInfo:function(e){
    var userInfo = e.detail.userInfo;
    console.log(userInfo)
    var self = this;
    self.setData({ loading: true });
    wx.login({
        success: function (_a) {
            var code = _a.code;
            console.log(code)
            let dataList={
              code:code,
              nickname:userInfo.nickName,
              avatar:userInfo.avatarUrl,
              gender:userInfo.gender,
            };
            comm.requestAjax('home/user/signup',dataList,'45545','post',function(res){
              console.log(res)//请求成功回调
              wx.setStorageSync('openid', res.openid);
              app.globalData.userId = res.id;
              wx.setStorageSync('userId', res.id)
              wx.switchTab({ url: '/pages/index/index' });
            },function(res){
              // wx.showToast({ title: '授权失败lo', icon: 'none' });
              console.log("shibai")
            });
        }
    })
  },
})