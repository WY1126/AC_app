// pages/text/text.js
const app=getApp()
const comm = require('../../../utils/request') 
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
    getimgpath:[],
    isfill:true,
    deleteIndex:-1,
    note_name:['二手货','失物','组队','圈子','好物分享','回家平台','维权','公告','其他'],
    note_type:null,               //板块类型
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
    var imgArr=this.data.chooseFile;
    //只能上传三张照片
    var leftCount=3-imgArr.length,that=this;
    if(leftCount<=0){
      return
    }
    wx.chooseImage({
      count: leftCount,
      sourceType:['album','camera'],
      success:function(res){
        console.log("选择图片成功",res.tempFilePaths)
        that.setData({
          chooseFile:imgArr.concat(res.tempFilePaths)
        });
        //设置addimg的可见性
        if(that.data.chooseFile.length>=3)
        {
          that.data.isfill=false
        }
        else{
          that.data.isfill=true
        }
        that.setData({
          isfill:that.data.isfill
        })
        console.log("isfill=",that.data.isfill)
        console.log(that.data.images)
      },
      fail(res){
        console.log("选择图片失败")
      }
    })
  },
  selectCloudFunction(){
    var status = null;
    var promise = new Promise((resolve,reject) => {
      wx.cloud.callFunction({
        name:'test',
        success(res){
          console.log(res);
          status = res.result.status;
          resolve();
        }
      })
    });
    promise.then(()=>{
      console.log("云函数执行结果是",status);
    })
  },
  //上传信息至云数据库
    send: function(){
    // var id;
    // if(this.data.chooseFile.length!=0){
    //   this.upLoad()
    // } else{
    // var that = this;
    // var promise = new Promise((resolve,reject)=>{
    //   that.upLoad()
    //   resolve()
    // });
    // promise.then(()=>{
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

  // })
  // }
  },

  //上传图片至服务器
  upLoad: function (e){
    var len = this.data.chooseFile.length,image = [],that = this;
    for(var i=0;i<len;i++)
    {
      wx.uploadFile({
        filePath: that.data.chooseFile[i],
        name: 'file',
        url: app.globalData.requestUrl+'forum/Note/uploadimg',
        success:(res)=>{
          // console.log(res)
          image.push(res.data)
          that.setData({
            image:image
          })
          // console.log(that.data.image)
          // if(i==(len)&&that.data.image.length==(len))
          // {
          //   that.send()

          // }
          // that.send()
        },
        fail:(res)=>{
          wx.showToast({
            title: '图片上传失败',
            icon:null
          })
        }
      })
    }
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
              image.push(res.data)
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
          title: '不得为空！',
          icon:'fail'
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
})