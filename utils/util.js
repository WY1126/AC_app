  /*  getDiffTime方法将评论的时间戳转化为
  * “多少分钟前，多少小时前，昨天，月日”等格式
  * para:
  * recordTime-(float),时间戳
  * yearsFlag-{bool} 是否要年份
  */
 function getDiffTime(recordTime,yearsFlag){
  if(recordTime){
    recordTime=new Date(parseFloat(recordTime)*1000);
    var minute=1000*60,
    hour=minute*60,
    day=hour*24,
    now=new Date(),
    diff=now-recordTime;
    var result='';
    if(diff<0){
      return result;
    }
    var weekR=diff/(7*day);
    var dayC=diff/day;
    var hourC=diff/hour;
    var minC=diff/minute;
    if(weekR>=1){
      var formate='MM-dd hh:mm';
      if(yearsFlag){
        formate='yyyy-MM-dd hh:mm';
      }
      return recordTime.format(formate);
    }
    else if(dayC==1||(hourC<24&&recordTime.getDate()!=now.getDate())){
      result='昨天'+recordTime.format('hh:mm');
      return result;
    }
    else if(dayC>1){
      var formate='MM-dd hh:mm';
      if(yearsFlag){
        formate='yyyy-MM-dd hh:mm';
      }
      return recordTime.format(formate);
    }
    else if(hourC>=1){
      result=parseInt(hourC)+'小时前';
      return result;
    }
    else if(minC>=1){
      result=parseInt(minC)+'分钟前';
      return result;
    }else {
      result='刚刚'
      return result;
    }
  }
  return '';
}
/**
 * 此方法来源于网络
 * 拓展Date方法，得到格式化的日期格式
 * date:format('yyyy-MM-dd'),date.format('yyyy/MM/dd'),date.format('yyyy.MM.dd')
 * date.format('dd.MM.yy'),date.format('yyyy.dd.MM'),date.fomat('yyyy-MM-dd HH:mm')
 * 使用方法如下：
 *  var date=new Date();
 *  var todayFormat=date.format('yyyy-MM-dd');
 * Parameters:
 * format-{string} 目标格式 类似于（'yyyy-MM-dd'）
 * returns-{string} 格式化后的日期
 */

 (function initTimeFormat(){
   Date.prototype.format=function(format){
     var o={
       "M+":this.getMonth()+1,//month
       "d+":this.getDate(),//day
       "h+":this.getHours(),//hour
       "m+":this.getMinutes(),//minute
       "s+":this.getSeconds(),//second
       "q+":Math.floor((this.getMonth+3)/3),//quarter
       "S+":this.getMilliseconds()//millisecond
     }
     if(/(y+)/.test(format))format=format.replace(RegExp.$1,
      (this.getFullYear()+"").substr(4-RegExp.$1.length));
      for(var k in o) if(new RegExp("("+k+")").test(format))
        format=format.replace(RegExp.$1,
          RegExp.$1.length==1?o[k]:
              ("00"+o[k]).substr((""+o[k]).length));
      return format;
   };
 })()

//输出converToStarsArray
 ////不需要深入研究上面这段代码，只需要知道它的作用即可。最后，在util.js的末尾添加以下代码：
 module.exports={
  getDiffTime:getDiffTime,
}