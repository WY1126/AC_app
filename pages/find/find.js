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
  },
  /**
   * 关闭弹出层
   */
  onClose() {
    this.setData({ show: false });
    this.setData({
      information_Id:0,   //资讯id
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
      input_content:'',
      placeholder:'说点什么吧',   //文本框占位符
      button_key:0,   //判断发送按钮的状态
      send_type:0,   //判断发送类型（评论/回复）
      input_focus:false,    //文本框焦点
    })
  },
  /**王瑶 2021-01-12 20:47
   * 显示弹出层
   * @param {*} e 
   */
  showPopup(e) {
    var information_id = e.currentTarget.dataset.informationId,
    information_idx = e.currentTarget.dataset.informationIdx,
    that = this,
    userId = wx.getStorageSync('userId');
    var num = this.data.list[information_idx].commentnum
    ,
    datalist={
      'nid':information_id,
      'uid':userId,
    };
    this.setData({
       show: true,
       information_Id:information_id,
       commentnum:num,
       information_Idx:information_idx
    });
    console.log(this.data.information_Id)
    console.log(wx.getStorageSync('userinfo'))
    var userinfo = wx.getStorageSync('userinfo');
    this.setData({
      user_Id:userinfo['id'],
      avatarurl:userinfo['avatar'],
      nickname:userinfo['nickname']
    })
    comm.requestAjax('association/Comment/getcomment',datalist,'请求中…','post',function(res){
      console.log(res)
      var len=res.length,comment,replycomment,reply,replylen;
      // console.log("len="+len)
      //修改时间格式
      for(var i=0;i<len;i++)
      {
        comment=res[i]
        comment.create_time=util.getDiffTime(comment.create_time,true);
        if(res[i].reply.length!=0)
        {
          reply = res[i].reply;
          replylen = res[i].reply.length;
          for(var j=0;j<replylen;j++)
          {
            // console.log('sa'+j)
            replycomment = reply[j];
            replycomment.create_time = util.getDiffTime(replycomment.create_time,true);
          }
        }
        // console.log("time= "+comment.create_time)
      }
      that.setData({
        comments:res
      })
    },
    function(res){
      wx.showToast({ title: '请求失败', icon: 'none' });
    })
  },
  /**王瑶 2021-01-12 20:12
   * 帖子点赞
   * @param {*} e 
   */
  dolike:function(e){
    var informationId = e.currentTarget.dataset.informationId,
    userId = wx.getStorageSync('userId'),
    that = this,
    idx = e.currentTarget.dataset.informationIdx,
    datalist = {
      nid:informationId,
      uid:userId
    };
    // console.log(e.currentTarget.dataset.informationIdx)
    comm.requestAjax('forum/Note/likenote',datalist,'','post',function(e){
      console.log(e.likenum)
      console.log(that.data.list)
      
      var templist = that.data.list,msg=e.error_msg;
      templist[idx].likenum = e.likenum;
      templist[idx].status=e.status;
      that.setData({
        list:templist
      })
      wx.showToast({
        title: msg,
      })
    }
    ,function(e){
      console.log('请求错误！')
    })
  },
  /** 王瑶 2021-01-12 20:11
   * 图片预览
   * @param {*} event 
   */
  previewImg:function(event){
    //获取文章评论序号
    var informationId=event.currentTarget.dataset.informationIdx,//data-comment-idx  自定义属性，有多个单词时自动转化为驼峰命名法。
    temp,imgId=event.currentTarget.dataset.imgId,//获取图片序号
    img=this.data.list[informationId].image,//获取评论所有图片
    imgs=[]; //解决图片预览bug 2020-12-26 23:33
    var len = img.length;
    for(var i=0;i<len;i++)
    {
      //将缩略图转换为真图
      // temp = img[i].split('@');
      // if(temp.length==2){
      //   img[i]=temp[0]+temp[1];
      // }
      imgs[i]=(this.data.avatarurlhead+img[i])
    }
    console.log(imgs)
    wx.previewImage({
      current:imgs[imgId],
      urls:imgs
    })
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