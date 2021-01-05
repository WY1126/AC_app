const app = getApp();
const comm=require("../../utils/request");
const util=require("../../utils/util");
Component({
    properties: {
        // defaultData（父页面传递的数据-就是引用组件的页面）
        defaultData: {
            type: Object,
            value: {
                title: "我是默认标题"
            },
            observer: function(newVal, oldVal) {}
        }
    },
    data: {
        navBarHeight: app.globalData.navBarHeight,
        menuRight: app.globalData.menuRight,
        menuBotton: app.globalData.menuBotton,
        menuHeight: app.globalData.menuHeight,
    },
    attached: function() {},
    methods: {
        searchnote:function(e){

            // console.log(e.detail.value)
            // var uid = wx.getStorageSync('userId'),
            // value = e.detail.value,page = 1,tab = 0,
            // url = 'forum/Note/searchnote',
            // data = {
            //     uid:uid,
            //     value:value,
            //     page:1,
            //     tab:0,
            // },
            // messge='搜索中…',method='get',that=this;
            // comm.requestAjax(url,data,messge,method,
            // function(res){
            //   console.log(res);
            //   if(res.error_code===0)
            //   {
            //     wx.showToast({ title: '没有更多', icon: 'none' });
            //     that.setData({
            //       page:-1
            //     })
            //   }else{
            //     var len=res.data.length,comment;
            //     // console.log("len="+len)
            //     for(var i=0;i<len;i++)
            //     {
            //       comment=res.data[i]
            //       comment.create_time=util.getDiffTime(comment.create_time,true);
            //       // console.log("time= "+comment.create_time)
            //     }
            //     var a=that.data.list;
            //     var temp=res.data;
                wx.navigateTo({
                    url: '/pages/find/searchnote/searchnote?value='+e.detail.value,
                  })
                // that.setData({
                //   page:Number(res.current_page)+1,
                //   list:temp
                // })
                // console.log(res)
                // console.log(that.data.list)
            //   }
            // },
            // function(res){
            //   wx.showToast({ title: '请求失败', icon: 'none' });
            // })
          

            
        }
    }
})
