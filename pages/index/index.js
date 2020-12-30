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
    list:[],
    avatarurlhead:app.globalData.avatarurlhead,
    show:false,
    information_Id:0,
    comments:[],
    commentnum:null,
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
    userId = wx.getStorageSync('userId')
    ;
    var num = this.data.list[information_idx].commentnum
    ,
    datalist={
      'iid':information_id,
      'uid':userId
    };
    this.setData({
       show: true,
       information_Id:information_id,
       commentnum:num
    });

    comm.requestAjax('association/Comment/getcomment',datalist,'','post',function(res){
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
  },

  /**对评论回复的点赞功能
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
    // console.log(userId)
    // wx.showToast({
    //   title: e.currentTarget.dataset.informationId,
    //   icon:"success"
    // })
  },
  onLoad: function () {
    // 如果缓存中没有openID
    var openID = wx.getStorageSync('openid')
    // console.log(openID)
    if(openID==""||openID==null) {
      wx.redirectTo({
        url: '/pages/user/signup/signup',
      })
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
  test(e){
    console.log('s')
  },
})