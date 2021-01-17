// pages/index/telphone/telphone.js
//获取应用实例
const app = getApp()
const comm=require("../../../utils/request")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list:[{
      id: 29,
      name: "段金玲",
      sector: "计算机学院",
      sid: 6,
      tel_num: "13697090728"
    }], //电话簿列表
    page:1,
    window_heigt:null,
    window_width:null,
    activeKey: 0,
    sector:0,//部门编号
    searchinfo:'',//搜索信息
    activeName: '1',
    phoneNumber:null,//拨打电话
    successkey:false,
    failkey:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =this;
    if(this.data.window_heigt==null||this.data.window_width==null){
      wx.getSystemInfo({
        success: function (res) {
          //获取屏幕窗口高度和宽度
          that.data.window_heigt = res.windowHeight
          that.data.window_width = res.windowWidth
          that.setData({
            window_heigt:that.data.window_heigt,
            window_width:that.data.window_width
          })
          console.log(that.data.window_heigt)
          console.log(that.data.window_width)
        },
      })
    }
    this.gettel();
  },
  
  //获取电话簿
  gettel:function(){
    var sector = this.data.sector,
    searchinfo = this.data.searchinfo,that=this,
    url = 'index/Telbook/gettel',
    data = {
      page:this.data.page,
      sector:sector,
      searchinfo:searchinfo
    },message = '请求中…',method = 'get';

    console.log("进来的page"+data.page)
    if(this.data.page>=0){
    comm.requestAjax(url,data,message,method,function(res){
      // console.log(res)
      if(res.error_code===1){
        that.setData({
          successkey:false,
          failkey:true,
        })
      }
      if(res.error_code===0)
      {
        wx.showToast({ title: '没有更多', icon: 'none' });
        that.setData({
          page:-1
        })
      }else{
        that.setData({
          activeName: '1',
        })
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
    })}
  },
  getmoretel:function(){
    console.log('tolow');
    this.gettel();
  },
  callPhone: function (e) {
    console.log(e.currentTarget.dataset.text)
    let that = this
        wx.makePhoneCall({
          phoneNumber: e.currentTarget.dataset.text//需要拨打的电话号码
        })
  },
  //搜索
  onSearch:function (res)
  {
    console.log(res.detail)
    this.setData({
      searchinfo:res.detail,
      page:1,
      list:[],
      activeKey: 0,
      successkey:true,
      failkey:false,
    })
    this.gettel();
  },
  //点击切换事件
  onChange(event) {
    // Notify({ type: 'primary', message: event.detail });
    console.log(event.detail)
    console.log(this.data.activeKey)
    this.setData({
      sector:event.detail,
      page:1,
      list:[],
      searchinfo:'',
      successkey:true,
      failkey:false,
    })
    this.gettel();
  },
  onChanges(event) {
    this.setData({
      activeName: event.detail,
    });
  },
  //复制电话号码
  copyText: function (e) {
    var that =this;
    console.log(e)
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})