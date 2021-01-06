// pages/find/find.js
//index.js
//获取应用实例
const app = getApp()
const comm=require("../../utils/request")
const util=require("../../utils/util")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabcur:0,             //当前tab标签索引值
    value:'',
    active:0,             //默认显示的tab标签页
    page:1,
    list:[],    //社团资讯内容分
    avatarurlhead:app.globalData.avatarurlhead,   //根地址
    show:false,   //popup弹出层标识
    information_Id:0,   //资讯id
    information_Idx:0,  //评论序号
    user_Id:0,    //用户Id
    avatarurl:'',   //用户头像地址
    nickname:'',    //用户昵称
    content:'',   //评论内容
    create_time:0,    //时间戳
    comment_Id:0,   //评论Id
    comment_Idx:0,  //评论序号
    reply_idx:0,    //回复id
    reply_idx:0,    //回复序号
    to_reply_id:0,  //判断是对评论的回复还是对回复的回复
    to_uid:0,       //被回复对象id
    to_nickname:'', //被回复对象昵称
    comments:[],    //评论列表
    commentnum:null,    //评论数
    input_content:'',   //评论回复内容
    placeholder:'说点什么吧',   //文本框占位符
    button_key:0,   //判断发送按钮的状态
    send_type:0,   //判断发送类型（评论/回复）
    input_focus:false,    //文本框焦点
    statusBarHeight:app.globalData.statusBarHeight,
    circle:[
      "dsada",
      "sdsadasd",
      "dsada",
      "sdsadasd",
      "dsada",
      "sdsadasd",
      "dsadsad",
      "dsad",
      "dsadsa"
    ],
    tabbarwords:['二手货','失物','组队','圈子','好物分享','回家平台','公告','其他','广告'],
  },
  
  //上拉获取5条数据
  getinfor:function(e){
    var uid = wx.getStorageSync('userId')
    console.log('ghj  '+uid)
    var temppage = {
      page:this.data.page,
      uid:uid,
      tab:this.data.tabcur
    },
    that = this;
    console.log("进来的page"+temppage.page)
    if(this.data.page>=0){
    comm.requestAjax("forum/Note/getnote",temppage,"请求更多…","post",
    function(res){
      console.log(res);
      if(res.error_code===0)
      {
        wx.showToast({ title: '没有更多', icon: 'none' });
        that.setData({
          page:-1
        })
      }else{
        var len=res.data.length,comment;
        // console.log("len="+len)
        for(var i=0;i<len;i++)
        {
          comment=res.data[i]
          comment.create_time=util.getDiffTime(comment.create_time,true);
          // console.log("time= "+comment.create_time)
        }
        var a=that.data.list;
        var temp=a.concat(res.data)
        that.setData({
          page:Number(res.current_page)+1,
          list:temp
        })
        // console.log(res)
        // console.log(that.data.list)
      }
    },
    function(res){
      wx.showToast({ title: '请求失败', icon: 'none' });
    })
  }
  },
  //搜索帖子
  searchnote:function (e){
    console.log(e.detail.value)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getinfor()
  },

  onChange(event) {
    wx.showToast({
      title: `切换到 ${event.detail.title}`,
      icon: 'none',
    });
    this.setData({
      tabcur:event.detail.name,
      page:1,
      list:[],    //社团资讯内容分
    })
    this.getinfor();
  },
  onSearch() {
    Toast('搜索' + this.data.value);
  },
  onClick() {
    Toast('搜索' + this.data.value);
  },
  //发送帖子
  sendnote:function (){
    wx.navigateTo({
      url:'/pages/find/send-note/send-note'
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
    this.getinfor();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})