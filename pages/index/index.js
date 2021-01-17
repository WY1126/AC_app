//index.js
//获取应用实例
const app = getApp()
const comm=require("../../utils/request")
const util=require("../../utils/util")
Page({
  data: {
    TabCur: 0,
    scrollLeft:0,
    active: 0,
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
    texts:null,
  },
  //失去焦点时触发
  onbindblur:function(e){
    this.setData({
      placeholder:'说点什么吧',
    })
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
  //send发送按钮事件
  send:function (e){
    console.log('send')
    if(this.data.send_type==0){
      //执行发送评论接口     comm.requestAjax(url,data,message,method,
      var requesturl = 'association/Comment/sendcomment',that = this,
      data = {
        iid : this.data.information_Id,
        uid : this.data.user_Id,
        content : this.data.input_content,
        avatarurl : this.data.avatarurl,
        create_time : Date.parse(new Date())/1000,
        nickname : this.data.nickname
      },
      message = '', method='post';
      comm.requestAjax(requesturl,data,message,method,function(e){
        console.log(e)
        e['reply'] = [];
        e['create_time'] = util.getDiffTime(e['create_time'],true)//修改时间格式
        var temp = that.data.comments,tempcommentnum=that.data.commentnum+1,templist=that.data.list; templist[that.data.information_Idx]['commentnum'] = tempcommentnum;
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
    if (this.data.send_type==1) {
      this.sendreply()
    }
  },
  //输入框为空时，非法发送
  nosend:function(e){
    console.log('nosend')
    console.log(Date.parse(new Date()))
  },
  //发送回复
  sendreply:function(e){
    console.log('发送回复')
    var requesturl = 'association/Comment/sendreply', that = this,
    data = {
    iid:this.data.information_Id,
    comment_id:this.data.comment_Id,
    uid:this.data.user_Id,
    nickname:this.data.nickname,
    avatarurl:this.data.avatarurl,
    to_reply_id:this.data.to_reply_id,
    comment:this.data.input_content,
    to_uid:this.data.to_uid,
    to_nickname:this.data.to_nickname,
    create_time : Date.parse(new Date())/1000,
    },
    message = '',method='post';
    console.log('sdas   '+JSON.stringify(data))
    comm.requestAjax('association/Comment/sendreply',data,message,method,function(e){
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
      to_nickname:to_nickname
    })
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
/**
 * 2020-12-21 王瑶 
 * 显示评论弹出层
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
      'iid':information_id,
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

  /**
   * 对评论回复的点赞功能
   * 2020-12-30 20:20 王瑶
   */
  dogood:function dg(params) {
    var type = params.currentTarget.dataset.goodType,
    id = params.currentTarget.dataset.requestId,
    uid = wx.getStorageSync('userId'),
    url = "association/Comment/good",
    commentidx = params.currentTarget.dataset.commentIdx,replyidx = params.currentTarget.dataset.replyIdx,
    data={
      type:type,
      id:id,
      uid:uid
    },
    message='',method='post',that=this;
    console.log('cidx  '+commentidx+"   ridx   "+replyidx)
    comm.requestAjax(url,data,message,method,function(e){
      console.log(e)
      var tempcomments = that.data.comments
      if(type==1){
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

  //获取5条社团资讯数据
  getinfor:function(){
    var uid = wx.getStorageSync('userId')
    console.log('ghj  '+uid)
    var temppage = {
      page:this.data.page,
      uid:uid
    },
    that = this
    ;
    console.log("进来的page"+temppage.page)
    if(this.data.page>=0){
    comm.requestAjax("association/Information/getnewinfor",temppage,"请求更多…","post",
    function(res){
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
        console.log(res)
        console.log(that.data.page)
      }
    },
    function(res){
      wx.showToast({ title: '请求失败', icon: 'none' });
    })
  }
  },
  /**
   * 2020-12-14
   * 实现图片预览
   * ----------就应该直接返回图片的绝对路径
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
      temp = img[i].split('@');
      if(temp.length==2){
        img[i]=temp[0]+temp[1];
      }
      imgs[i]=(this.data.avatarurlhead+img[i])
    }
    console.log(imgs)

    // console.log("sa"+imgs)
    // console.log("a=  "+informationId+ "    b=  "+imgId)
    // console.log(this.data.avatarurlhead+imgs[imgId])
    wx.previewImage({
      current:imgs[imgId],
      urls:imgs
    })
  },
  /**2020-12-15 20：38
   * 社团资讯点赞按钮
   * 
   */
  dolike:function(e){
    var informationId = e.currentTarget.dataset.informationId,
    userId = wx.getStorageSync('userId'),
    that = this,
    idx = e.currentTarget.dataset.informationIdx,
    datalist = {
      iid:informationId,
      uid:userId
    };
    // console.log(e.currentTarget.dataset.informationIdx)
    comm.requestAjax('association/Information/likeinformation',datalist,'','post',function(e){
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
  onLoad: function () {
    // 如果缓存中没有openID
    var openID = wx.getStorageSync('openid')
    // console.log(openID)
    if(openID==""||openID==null) {
      wx.redirectTo({
        url: '/pages/user/signup/signup',
      })
    } else { //执行更新用户头像

    }
    this.getinfor()
    console.log(this.data.avatarurlhead)
  },
    /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getinfor()
  },
  onChange(event) {
    wx.showToast({
      title: `切换到标签 ${event.detail.name}`,
      icon: 'none',
    });
    console.log(event.detail.name)
  },
  test(e){
    console.log('s')
  },
  //跳转至校园通讯录页
  telphone:function(){
    wx.navigateTo({
      url: '../index/telphone/telphone',
    })
  },
  //跳转至校区新闻
  tonews:function (){
    wx.navigateTo({
      url: '../index/index-news/index-news',
    })
  },
  da:function(){
    var that = this;
    wx.request({
      url: 'http://127.0.0.1/AC_tp/public/news/News/getnewscontent?rurl=https://www.jxutcm.edu.cn/info/1010/29183.htm',
      success (res) {
        console.log(res.data);
        that.setData({
          texts:res.data['content']
        })
      }
    },
 )
  }
})