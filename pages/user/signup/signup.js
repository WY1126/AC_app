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
              app.globalData.userId = res.id;
              wx.setStorageSync('userId', res.id)
              wx.setStorageSync('userinfo', res)
              wx.switchTab({ url: '/pages/index/index' });
            })
            .catch((err)=>{
              // wx.showToast({ title: err, icon: 'none' });
              console.log(err)
            })

            // const setDelay = (millisecond) => {
            //   return new Promise((resolve, reject)=>{
            //       if (typeof millisecond != 'number') reject(new Error('参数必须是number类型'));
            //       setTimeout(()=> {
            //         resolve(`我延迟了${millisecond}毫秒后输出的`)
            //       }, millisecond)
            //   })
            // }
            // setDelay('我是字符串')
            // .then((result)=>{
            //     console.log(result) // 不进去了
            // })
            // .catch((err)=>{
            //     console.log(err) // 输出错误：“参数必须是number类型”
            // })

            // comm.requestAjax('home/user/signup',dataList,'正在请求','post',function(res){
            //   console.log(res)//请求成功回调
            //   wx.setStorageSync('openid', res.openid);
            //   app.globalData.userId = res.id;
            //   wx.setStorageSync('userId', res.id)
            //   wx.setStorageSync('userinfo', res)
            //   wx.switchTab({ url: '/pages/index/index' });
            // },function(res){
            //   wx.showToast({ title: '授权等待…', icon: 'none' });
            // });



        }
    })
  },
})