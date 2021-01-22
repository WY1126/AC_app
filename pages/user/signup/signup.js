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
    // console.log(userInfo)
    var self = this;
    self.setData({ loading: true });
    wx.login({
        success: function (_a) {

            var code = _a.code;
            let dataList={
              code:code,
              nickname:userInfo.nickName,
              avatar:userInfo.avatarUrl,
              gender:userInfo.gender,
            };
            const setDelay = ()=>{
              return new Promise((resolve,reject)=>{
                comm.requestAjax('home/user/signup',dataList,'正在请求','post',function(res){
                  console.log(res)//请求成功回调
                  resolve(res)
                },function(res){
                  wx.showToast({ title: '授权等待…', icon: 'none' });
                  reject(new Error('请求失败'))
                });
              })
            };
            setDelay()
            .then((res)=>{
              wx.setStorageSync('openid', res.openid);
              console.log("oprnid  "+wx.getStorageSync('openid'))
              app.globalData.userId = res.id;
              wx.setStorageSync('userId', res.id)
              wx.setStorageSync('userinfo', res)
              wx.switchTab({ url: '/pages/index/index' });
            })
            .catch((err)=>{
              // wx.showToast({ title: err, icon: 'none' });
              console.log(err)
            })

        }
    })
  },
})