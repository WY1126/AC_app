 //压缩并获取图片
function getCanvasImg (tempFilePaths) {
  if(tempFilePaths.length<=0)
    return;
  var that = this;
  wx.showLoading();
  wx.getImageInfo({
    src: tempFilePaths[0], //图片的路径，可以是相对路径，临时文件路径，存储文件路径，网络图片路径,  
    success: res => {
      that.data.canv.width = that.data.window_width/1.5;
      that.data.canv.height = that.data.window_width / res.width * res.height/1.5;
      that.setData({
        canv: that.data.canv
      })
      const ctx = wx.createCanvasContext('attendCanvasId');
      setTimeout(() => {
        ctx.drawImage(tempFilePaths[0], 0, 0, that.data.canv.width, that.data.canv.height);
        ctx.draw(true, function () {
          wx.canvasToTempFilePath({
            canvasId: 'attendCanvasId',
            success: function (res) {
              wx.hideLoading();
              that.data.chooseFile = that.data.chooseFile.concat(res.tempFilePath)
              that.setData({
                chooseFile: that.data.chooseFile
              })
              that.data.tempchooseFile.shift();
              that.getCanvasImg(that.data.tempchooseFile)
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
}
module.exports = {
  getCanvasImg: getCanvasImg,
}
//这里必须写上  否则小程序调取不到方法 我前面文章有写到怎么调用方法