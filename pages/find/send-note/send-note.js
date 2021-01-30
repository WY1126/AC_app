// pages/text/text.js
// import Toast from 'path/to/@vant/weapp/dist/toast/toast';
//https://acimages-1302835316.cos.ap-shanghai.myqcloud.com/
const app=getApp();
const comm = require('../../../utils/request');
const uitl = require('../../../utils/util');
const config = require('../../../libs/config');
const COS = require('../../../libs/cos-wx-sdk-v5');

const cos = new COS({
  SecretId: config.SecretId,
  SecretKey: config.SecretKey,
});


var toastMsg = '';
const imglen=3;//选择图片的长度
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileList: [], //图片预览数据
    date: '', //获取时间作为文件夹命名 如20210122
    img:[],
    imgUrl:[],  //存储对象存储 路径
    sendRequestKey:true, //发送评论按钮状态，防止用户重复点击造成混乱
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
    note_name:['二手货','失物','组队','圈子','好物分享','回家平台','吐槽','公告','其他'],
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

// 图片上传至对象存储开始

//选择图片后
afterRead:function(event){
  toastMsg = "上传";
  var that = this;
  /* 批量上传 */
  var files = event.detail.file; //数组
  for (var i = 0; i < files.length; i++) {
    var filePath = files[i].url;
    var filename = new Date().getTime()  + filePath.substr(filePath.lastIndexOf('/') + 1);
    //文件相对路径名
    var relativePath = 'upload/' + that.data.date + '/' + filename;
    cos.postObject({
      Bucket: config.Bucket,
      Region: config.Region,
      Key: relativePath,
      FilePath: filePath,
      onProgress: function (info) {
          console.log(JSON.stringify(info));
      }
  }, function (err, data) {
    var location = data.headers.location;
    location = location.toString().replace(app.globalData.cosUrl,'');
    // var location = relativePath;
    that.data.imgUrl.push(location);
    console.log("location   "+location)
    // that.data.img.push(location);
    that.setData({
      // img:that.data.img,
      imgUrl:that.data.imgUrl
    })
    // console.log(that.data.img)
      // console.log(err || data);
      console.log(that.data.imgUrl)
  });
    //添加到预览中
    var img = {
      id: i,
      url: app.globalData.cosUrl + relativePath,
      name: filename
    }
    //读取缓存
    let list = wx.getStorageSync('fileList');
    if (list) {
      list.push(img);
    } else {
      list = [img];
    }
    //存入缓存
    wx.setStorageSync('fileList', list);
  }
  // that.updateData();
  // 延迟更新数据
  setTimeout(function () {     
    that.updateData();
  }, 2000);



},

  //更新数据
updateData() {
  this.setData({
    fileList: wx.getStorageSync('fileList')
   });
},

//删除图片
delFile(event) {
  toastMsg = "删除";
  var that = this;
  var index = event.detail.index;
  //读取缓存
  let list = wx.getStorageSync('fileList');
  var filename = list[index].name;
  var url = list[index].url;
  url = url.replace(app.globalData.cosUrl,'');
  console.log("filename  "+url)
  //更新fileList中的数据
  for (let i = 0; i < list.length; i++) {
    //如果item是选中的话，就删除它。
    if (filename == list[i].name) {
      // 删除对应的索引
      list.splice(i, 1);
      break;
    }
  }
  that.data.imgUrl.splice(index,1);
  that.setData({
    imgUrl:that.data.imgUrl
  })
  console.log(that.data.imgUrl)
  //更新缓存
  wx.setStorageSync('fileList', list);
  //更新数据
  that.updateData();
  cos.deleteObject({
    Bucket: config.Bucket,
    Region: config.Region,
    Key: url,
  }, function (err, data) {
    console.log(err || data);
  });
},
  /**
   * 生命周期函数--监听页面卸载  清除图片缓存,删除存储库图片
   */
  onUnload: function () {
    wx.setStorageSync('fileList', '')
      //读取缓存
    var list = wx.getStorageSync('fileList');
    for(var i=0;i<list.length;i++)
    {
      var url = list[i].url;
      url = url.replace(app.globalData.cosUrl,'');
      cos.deleteObject({
        Bucket: config.Bucket,
        Region: config.Region,
        Key: url,
      }, function (err, data) {
        console.log(err || data);
      });
    }
    // wx.clearStorageSync('fileList')

  },




// 图片上传至对象存储结束

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
    //获取用户id//获取时间，作为图片文件夹名，如20191207
    this.setData({
      uid:wx.getStorageSync('userId'),
      date:uitl.dateFormat(new Date(),'YMD')
    })
    //清除缓存
    //wx.removeStorageSync('fileList');
    //获取缓存中的地址
    this.updateData();
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
    if(this.data.imgUrl.length<=0 && this.data.content == ''){
      wx.showToast({
        title: '内容不得为空',
      })
      return;
    }
    if(this.data.note_type==null){
      this.setData({
        sendRequestKey:true,//禁用send按钮
      })
      wx.showToast({
        title: '请选择板块',
      })
      // wx.hideToast()
      return;
    }

    var url = 'forum/Note/sendnote',that = this,
    data = {
      uid:this.data.uid,
      content:this.data.content,
      tab:this.data.note_type+1,
      create_time: Date.parse(new Date())/1000,
      image:JSON.stringify( this.data.imgUrl ),
    },message='发布…',method='post';
    comm.requestAjax(url,data,message,method,function(res){
      if(res.error_code==0) {
        that.setData({
          sendRequestKey:true,//禁用send按钮
        })
        wx.showToast({ title: res.msg, icon: 'none' });
        return;
      }
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
    this.setData({
      sendRequestKey:false,//禁用send按钮
    })
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
          that.setData({
            sendRequestKey:true,//禁用send按钮
          })
          wx.showToast({
            title: '内容不得为空！',
            icon:'error'
          })
          console.log(that.data.sendRequestKey)
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
      that.data.canv.width = that.data.window_width*5/10;
      that.data.canv.height = that.data.window_width / res.width * res.height*5/10;
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
              // that.getCanvasImg(that.data.tempchooseFile)
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