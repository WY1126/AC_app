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
    avatarurlhead:app.globalData.avatarurlhead
  },
  //获取5条社团资讯数据
  getinfor:function(){
    var temppage = {
      page:this.data.page
    },that = this;
    console.log("进来的page"+temppage.page)
    if(this.data.page>=0){
    comm.requestAjax("association/Information/getnewinfor",temppage,"请求更多…","get",
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
   */
  previewImg:function(event){
    //获取文章评论序号
    var informationId=event.currentTarget.dataset.informationId,//data-comment-idx  自定义属性，有多个单词时自动转化为驼峰命名法。
    imgId=event.currentTarget.dataset.imgId,//获取图片序号
    imgs=this.data.list[informationId].image;  //获取评论所有图片
    console.log("sa"+imgs)
    console.log("a=  "+informationId+ "    b=  "+imgId)
    wx.previewImage({
      current:imgs[imgId],
      urls:imgs
    })
  },
  /**2020-12-15 20：38
   * 社团资讯点赞按钮
   * 开发中
   */
  dolike:function(){
    wx.showToast({
      title: '点赞成功',
      icon:"success"
    })
  },
  onLoad: function () {
    //如果缓存中没有openID
    // var openID = wx.getStorageSync('openid')
    // // console.log(openID)
    // if(openID==="") {
    //   wx.redirectTo({
    //     url: '/pages/user/signup/signup',
    //   })
    // }
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