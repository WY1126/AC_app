// pages/text/text.js
// import Toast from 'path/to/@vant/weapp/dist/toast/toast';
const app=getApp();
const comm = require('../../../utils/request');
const imglen=3;//选择图片的长度
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid:null,
    image:[],
    time:'',
    name:'',
    content:'',
    avatar:'',
    chooseFile:[],
    tempchooseFile:[],
    getimgpath:[],
    isfill:true,
    deleteIndex:-1,
    note_name:['二手货','失物','组队','圈子','好物分享','回家平台','维权','公告','其他'],
    note_type:null,               //板块类型

    images: [], //拍照图片
    upImages: [], //上传后图片路径
    window_heigt: '', //屏幕高
    window_width: '', //屏幕宽
    canv: {
      width: '', //canvas宽
      height: '', //canvas高
    },
  },
  /**
   * 图片预览
   * @param {*} event 
   */
  previewImg:function(event){
    var imgId=event.currentTarget.dataset.imgIdx;//获取图片序号
    wx.previewImage({
      current:this.data.chooseFile[imgId],
      urls:this.data.chooseFile
    })
  },
  //点击选择板块类型事件
  select_note_type:function(e){
    console.log(e.currentTarget.dataset.idx)
    this.setData({
      note_type:e.currentTarget.dataset.idx
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取用户id
    this.setData({
      uid:wx.getStorageSync('userId')
    })
  },
  //获取文本框输入的内容
  gettextvalue:function(event){
    console.log("text",event.detail.value)
    this.setData({
      content:event.detail.value
    })
  },
  //选择图片
  addimg:function(event){
    //选择图片数组
    var i=0;
    var imgArr=this.data.chooseFile,
    tempimg=this.data.tempchooseFile;
    console.log('len=  '+imgArr.length)
    //只能上传三张照片
    var leftCount=imglen-imgArr.length,that=this;
    if(leftCount<=0){
      return
    }
    wx.chooseImage({
      count: leftCount,
      sizeType: ['compressed'],
      sourceType:['album','camera'],
      success:function(res){
        console.log("选择图片成功",res.tempFilePaths)
        console.log(res.tempFilePaths[0].size)
        that.setData({
          tempchooseFile:tempimg.concat(res.tempFilePaths)
        });

        console.log("isfill=",that.data.isfill)
        console.log(that.data.images)
        that.getCanvasImg(that.data.tempchooseFile)
        // that.cp(that.data.tempchooseFile)

      },
      fail(res){
        console.log("选择图片失败")
      }
    })
  },
  /**
   * 将帖子信息存数据库并跳转至find页
   * 王瑶 2021-01-07  10:37
   */
  send: function(){
    if(this.data.note_type==null){
      wx.showToast({
        title: '请选择板块',
      })
      // wx.hideToast()
      return;
    }
    var url = 'forum/Note/sendnote',
    data = {
      uid:this.data.uid,
      content:this.data.content,
      tab:this.data.note_type+1,
      create_time: Date.parse(new Date())/1000,
      image:JSON.stringify( this.data.image ),
    },message='发布…',method='post';
    comm.requestAjax(url,data,message,method,function(res){
      console.log(res.data)
      // id=res.data.id
      wx.setStorageSync('send_note', res);
      wx.switchTab({
        url: '/pages/find/find',
      })
    },
    function (e){
      wx.showToast({ title: '请求失败', icon: 'none' });
    })
  },

  /**
   * 2021-01-06 22:49 发送帖子功能
   * 解决异步问题-Promise
   * https://blog.csdn.net/qq_40765537/article/details/97785304?utm_medium=distribute.pc_relevant.none-task-blog-baidujs_title-2&spm=1001.2101.3001.4242
   */
  sendnote:function(){
    var len = this.data.chooseFile.length,image = [],that = this;
    var promise = Promise.all(that.data.chooseFile.map((imgPath, index) => {
      return new Promise(function(resolve, reject) {
        if (imgPath != "") {
          wx.uploadFile({
            url:app.globalData.requestUrl+'forum/Note/uploadimg',//开发者服务器url
            filePath: imgPath,
            name: 'file',
            header: {
              "Content-Type": "multipart/form-data"
            },
            formData: {},
            success: function(res) {
              resolve(res.data); //这里要加resolve（）函数，参数可为空，不加的话promise无法达到预期效果。
              console.log("success");
              image.push(res.data)//将图片路径压入数组
              that.setData({
                image:image
              })
            },
            fail: function(err) {
              reject();//同样要加reject
              console.log("fail");
            },
          });
        } else {
          resolve(index);
        }
      });
    }));
    promise.then(function onFulfilled(value) {
  //这里编写回调函数的代码，甚至可以再加一个网络请求的函数
  //执行发送请求
      if(that.data.image.length!=0||that.data.content!='')
      {
        // console.log(that.data.image)
        that.send()
      } else{
        wx.showToast({
          title: '内容不得为空！',
          icon:'error'
        })
      }
    })
      .catch(function onRejected(error) {
        wx.hideLoading();
        console.log('图片上传失败');
      });
  },
  //删除已经选择的图片
  deleteImage:function(event){
    var index=event.currentTarget.dataset.idx,
      that=this;
    that.setData({
      deleteIndex:index
    });
    that.data.chooseFile.splice(index,1);
    console.log("getimgPath 数据删除后",this.data.chooseFile)
    setTimeout(function(){
      that.setData({
        deleteIndex:-1,
        chooseFile:that.data.chooseFile,
        // getimgpath:that.data.getimgpath,
        isfill:true
      });
    },500)
  },
  /**
* 生命周期函数--监听页面初次渲染完成
*/
onReady: function () {
  var that = this;
  wx.getSystemInfo({
    success: function (res) {
      //获取屏幕窗口高度和宽度
      that.data.window_heigt = res.windowHeight
      that.data.window_width = res.windowWidth
    },
  })
 },
 //压缩并获取图片
getCanvasImg: function (tempFilePaths) {
  if(tempFilePaths.length<=0)
  {
    // console.log(tempFilePaths[0].size)
    return;
  }
    
  var that = this;
  wx.showLoading();
  wx.getImageInfo({
    src: tempFilePaths[0], //图片的路径，可以是相对路径，临时文件路径，存储文件路径，网络图片路径,  
    success: res => {
      // if((res.width*res.length/2048)<50){
      //   console.log('return');
      //   return;
      // }
      console.log(res);
      that.data.canv.width = that.data.window_width;
      that.data.canv.height = that.data.window_width / res.width * res.height;
      that.setData({
        canv: that.data.canv
      })
      var ctx = wx.createCanvasContext('attendCanvasId');
      setTimeout(() => {
        ctx.drawImage(tempFilePaths[0], 0, 0, that.data.canv.width, that.data.canv.height);
        ctx.draw(false, function () {
          wx.canvasToTempFilePath({
            canvasId: 'attendCanvasId',
            success: function (res) {
              wx.hideLoading();
              that.data.chooseFile = that.data.chooseFile.concat(res.tempFilePath)
              that.setData({
                chooseFile: that.data.chooseFile
              })
                      //设置addimg的可见性
              if(that.data.chooseFile.length>=imglen)
              {
                that.data.isfill=false
              }
              else{
                that.data.isfill=true
              }
              that.setData({
                isfill:that.data.isfill
              })
              that.data.tempchooseFile.shift();
              that.getCanvasImg(that.data.tempchooseFile)
              that.setData({
                tempchooseFile:that.data.tempchooseFile
              })
            },
            fail: function (e) {
              that.getCanvasImg(tempFilePaths);
              console.log('file')
            },
            complete:()=>{
              that.getCanvasImg(that.data.tempchooseFile)
            }
          });
        });
      }, 1000);
    },
    fail: () => {
      console.log('file')
    },
    complete: () => {}
  });
},
})