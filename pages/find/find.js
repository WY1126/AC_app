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
    send_icon_key:1,      //发送帖子按钮的显示key
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
  //发送回复
  sendreply:function(e){
    console.log('发送回复')
    var requesturl = 'forum/Comment/sendreply', that = this,
    data = {
    nid:this.data.information_Id,
    comment_id:this.data.comment_Id,
    uid:this.data.user_Id,
    // nickname:this.data.nickname,
    // avatarurl:this.data.avatarurl,
    to_reply_id:this.data.to_reply_id,
    content:this.data.input_content,
    to_uid:this.data.to_uid,
    // to_nickname:this.data.to_nickname,
    create_time : Date.parse(new Date())/1000,
    },
    message = '',method='post';
    console.log('sdas   '+JSON.stringify(data))
    comm.requestAjax(requesturl,data,message,method,function(e){
      console.log(e)
      e['create_time'] = util.getDiffTime(e['create_time'],true)//修改时间格式
      var tempcomments = that.data.comments,tempcommentnum=that.data.commentnum+1,templist=that.data.list;   
      templist[that.data.information_Idx]['commentnum'] = tempcommentnum;
      tempcomments[that.data.comment_Idx]['reply'].unshift(e);
      that.setData({
        comments:tempcomments,
        commentnum:tempcommentnum,
        list:templist,
      })      
    },
    function(e){
      wx.showToast({ title: '请求失败', icon: 'none' });
    });
  },
  //触发回复内容
  touch_reply:function (event){
    var replyid = event.currentTarget.dataset.replyId,
    replyIdx = event.currentTarget.dataset.replyIdx;
    var commentidx = event.currentTarget.dataset.commentIdx,that=this,
    commentid = event.currentTarget.dataset.commentId,
    to_uid = this.data.comments[commentidx]['uid'],
    to_nickname = this.data.comments[commentidx]['reply'][replyIdx]['nickname'];
    console.log(to_nickname)
    console.log('uid  '+to_uid)
    this.setData({
      placeholder:'回复'+to_nickname,
      input_focus:true,
      send_type:1,
      comment_Id:commentid,
      to_reply_id:replyid,
      comment_Idx:commentidx,
      to_uid:to_uid,
      to_nickname:to_nickname
    })
  },
  //触摸评论内容事件
  touch_comment:function (event) {
    var commentidx = event.currentTarget.dataset.commentIdx,that=this,
    commentid = event.currentTarget.dataset.commentId,
    to_uid = this.data.comments[commentidx]['uid'],
    to_nickname = this.data.comments[commentidx]['nickname'];
    console.log('uid  '+to_uid)
    this.setData({
      placeholder:'回复'+to_nickname,
      input_focus:true,
      send_type:1,
      comment_Id:commentid,
      to_reply_id:0,
      comment_Idx:commentidx,
      to_uid:to_uid,
      // to_nickname:to_nickname
    })
  },
  //send发送按钮事件 判断发送评论还是回复
  send:function (e){
    console.log('send')
    if(this.data.send_type==0){
      //执行发送评论接口     comm.requestAjax(url,data,message,method,
      var requesturl = 'forum/Comment/sendcomment',that = this,
      data = {
        nid : this.data.information_Id,
        uid : this.data.user_Id,
        content : this.data.input_content,
        // avatarurl : this.data.avatarurl,
        create_time : Date.parse(new Date())/1000,
        // nickname : this.data.nickname
      },
      message = '', method='post';
      comm.requestAjax(requesturl,data,message,method,function(e){
        console.log(e)
        e['reply'] = [];
        e['create_time'] = util.getDiffTime(e['create_time'],true)//修改时间格式
        var temp = that.data.comments,
        tempcommentnum=that.data.commentnum+1,
        templist=that.data.list; 
        templist[that.data.information_Idx]['commentnum'] = tempcommentnum;
        console.log(templist)
        temp.unshift(e);
        that.setData({
          comments:temp,
          input_content:'',
          input_focus:false,
          button_key:0,
          commentnum:tempcommentnum,
          list:templist,
        })
        console.log(that.data.comments)
      },
      //请求失败
      function(e){
        wx.showToast({ title: '请求失败', icon: 'none' });
      })
    } 
    //发送回复
    if (this.data.send_type==1) {
      this.sendreply()
    }
  },
  //失去焦点时触发
  onbindblur:function(e){
    this.setData({
      placeholder:'说点什么吧',
    })
  },
  //输入框为空时，非法发送
  nosend:function(e){
    console.log('nosend')
    console.log(Date.parse(new Date()))
  },
  //文本框binginput输入事件
  ipbindinput:function(event){
    console.log(event.detail.value)
    var key=0;
    this.setData({
      input_content:event.detail.value
    })
    if(event.detail.value.length>0)
      key=1;
    else key=0;
    this.setData({
      button_key:key
    })
  },
  //评论回复的点赞
  dogood:function (params) {
    console.log('dogood')
    var type = params.currentTarget.dataset.goodType,
    id = params.currentTarget.dataset.requestId,
    uid = wx.getStorageSync('userId'),
    url = "forum/Comment/dolike",
    commentidx = params.currentTarget.dataset.commentIdx,
    replyidx = params.currentTarget.dataset.replyIdx,
    data={
      type:type,
      id:id,
      uid:uid,
      create_time:Date.parse(new Date())/1000
    },
    message='',method='get',that=this;
    console.log(type)
    console.log('cidx  '+commentidx+"   ridx   "+replyidx)
    comm.requestAjax(url,data,message,method,function(e){
      console.log(e)
      var tempcomments = that.data.comments
      if(type==0){
        if(e.status==0) {
          tempcomments[commentidx]['reply'][replyidx]['likenum']-=1;
        } else {
          tempcomments[commentidx]['reply'][replyidx]['likenum']+=1;
        }
        tempcomments[commentidx]['reply'][replyidx]['status']=e.status;
      } else {
        if(e.status==0) {
          tempcomments[commentidx]['likenum']-=1;
        } else {
          tempcomments[commentidx]['likenum']+=1;
        }
        tempcomments[commentidx]['status']=e.status;
      }
      that.setData({
        comments:tempcomments
      })
      wx.showToast({
        title:e.error_msg,
      })
    },
    function(res){
      wx.showToast({ title: '请求失败', icon: 'none' });
    })
  },
  /**
   * 显示评论框，获取评论和回复
   * 王瑶 2021-01-14 20:03
   * @param {*} e 
   */
  showPopup(e) {
    var information_id = e.currentTarget.dataset.informationId,
    information_idx = e.currentTarget.dataset.informationIdx,
    that = this,
    userId = wx.getStorageSync('userId');
    var num = this.data.list[information_idx].commentnum,
    datalist={
      'nid':information_id,
      'uid':userId,
      'page':1
    };
    this.setData({    //为什么要setData？？？？？？
       show: true,
       information_Id:information_id,
       commentnum:num,
       information_Idx:information_idx,
       send_icon_key:0,
    });
    // console.log(this.data.information_Id)
    // console.log(wx.getStorageSync('userinfo'))
    var userinfo = wx.getStorageSync('userinfo');
    this.setData({
      user_Id:userinfo['id'],
      avatarurl:userinfo['avatar'],
      nickname:userinfo['nickname']
    })
    comm.requestAjax('forum/Comment/getcomment',datalist,'请求中…','get',function(res){
      console.log(res.data)
      var res =res.data;
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
      console.log(that.data.comments)
    },
    function(res){
      wx.showToast({ title: '请求失败', icon: 'none' });
    })
  },
  /**
   * 关闭弹出层
   */
  onClose() {
    this.setData({ show: false });
    this.setData({
      send_icon_key:1,
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


  /**
   * 王瑶 2021-01-12 20:12
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
    for(var i=0;i<len;i++){
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