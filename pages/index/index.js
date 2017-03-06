var common = require('../../utils/util.js');
/*每个元素都有特定的id和index包括已删除的，修改删除等操作需要遍历当前点击的index值与缓存内的id值匹配之后执行对应操作*/
var page_app = getApp();
Page({
  data: {
    hasEmptyGrid: false,
    dayHide: true,
    TaskItems: wx.getStorageSync('tasksData') || [],
    // TaskItems: [//内容列表
      // {value: '内容1', finshed: true, id : 0},
      // {value: '内容2', finshed: false, id : 1},
      // {value: '内容3', finshed: true, id : 2},
      // {value: '内容4', finshed: true, id : 3},
      // {value: '内容5', finshed: false, id : 4},
      // {value: '内容6', finshed: true, id : 5},
    // ],
    newTask: '',
    focus: false,
    day: '点此设置'
  },
  onShareAppMessage() {
    return {
      title: '小程序任务提醒',
      desc: '任务列表',
      path: 'pages/index/index'
    }
  },
  onLaunch: function () {
    //当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
  },
  onShow:function(){//页面加载
    this.setData({
      TaskItems: wx.getStorageSync('tasksData') || []
    })
    // wx.clearStorageSync()//清空下缓存
  },
  onShow: function () {
    this.setData({
      TaskItems: wx.getStorageSync('tasksData') || []
    })
    console.log(common.formatTime(new Date()).split(' ')[0])
    
    //当小程序启动，或从后台进入前台显示，会触发 onShow
  },
  upper: function(e) {
    console.log(e)
  },
  lower: function(e) {
    console.log(e)
  },
  scroll: function(e) {
    console.log(e)
  },
  scrollToTop: function(e) {
    this.setAction({
      scrollTop: 0
    })
  },
  bindDateChange: function(e) {//选择日期
    this.setData({
      day: e.detail.value
    })
  },
  mytouchstart: function(e){//解决长按删除组件1
    let that = this;  
    that.setData({  
      touch_start: e.timeStamp  
    })  
  },
  mytouchend: function(e){
    let that = this;  
    that.setData({  
      touch_end: e.timeStamp  
    })  
  },
  taskDetail: function(e){//页面跳转
    let _this = this;  
    //触摸时间距离页面打开的毫秒数  
    var touchTime = _this.data.touch_end - _this.data.touch_start;  
    //如果按下时间大于350为长按  
    if (touchTime > 350) {
      let AllDatas = _this.data.TaskItems;//所有设置的任务
      let newData = AllDatas.concat();

      let nowID = e.target.dataset.index;//当前点击的index

      wx.showModal({
        title: '提示',
        content: '是否删除',
        success: function(res) {
          if (res.confirm) {
            AllDatas.map(function(data,_index){///删除对应的数据
              if(data.id == nowID){
                AllDatas.splice(_index,1);
              }
            })

            // AllDatas[e.target.dataset.index].finshed = !AllDatas[e.target.dataset.index].finshed;//改变当前数据的完成状态
            _this.setData({
              TaskItems: AllDatas
            })
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 1000
            })
            wx.setStorageSync('tasksData', AllDatas);
          }
        }
      })
    }else{
      let id = e.target.dataset.index;
      (id == 0 || id) && wx.navigateTo({
          url: '../detail/detail?id='+id
      })
    }
  },
  changeStatus: function(e){
    let 
    _this = this,
    AllDatas = _this.data.TaskItems;//所有设置的任务

    let nowIndex = e.target.dataset.index;//当前点击的index

    AllDatas.map(function(obj){
      if(obj.id == nowIndex){
        obj.finshed = !obj.finshed;//改变当前数据的完成状态
      }
    })

    _this.setData({
      TaskItems: AllDatas
    })
    wx.setStorageSync('tasksData', AllDatas);
  },
  getInputTask: function(e){//新建任务1 获取值
    this.setData({
      newTask: e.detail.value
    })
  },
  newTask: function(e){//新建任务2 设置值
    var newStr = this.data.newTask;
    var _this = this
    if(!newStr){
      wx.showModal({
        title: '未填写内容',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            _this.setData({
              focus: true
            })
          }
        }
      })
      return;
    }
    var dataID = wx.getStorageSync('dataID', AllDatas) || 0;//任务id  每次改变需要写入缓存
    let
    AllDatas = this.data.TaskItems;//所有设置的任务
    let newDatas = {value: this.data.newTask, finshed: false, id : dataID, time: common.formatTime(new Date()), day: this.data.day};
    this.data.newTask = "";

    dataID++;//设置设置ID  并写入缓存
    wx.setStorageSync('dataID', dataID);
    
    AllDatas.push(newDatas);

    this.setData({
      TaskItems: AllDatas,
      newTask: "",
      day: '未限定日期'
    })
    wx.setStorageSync('tasksData', AllDatas);
  },
  showSelectDate(){//显示选择日期
    const date = new Date();
    const cur_day = date.getDate();
    const now_year = date.getFullYear(),cur_year = date.getFullYear();
    const now_month = date.getMonth() + 1,cur_month = date.getMonth() + 1;
    const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
    this.calculateEmptyGrids(cur_year, cur_month);
    this.calculateDays(cur_year, cur_month);
    this.getSystemInfo();
    this.setData({
      cur_day,
      now_year,
      now_month,
      cur_year,
      cur_month,
      weeks_ch,
      dayHide: false
    })
  },
  hideSelectDate(){//隐藏选择日期
    this.setData({
      dayHide: true
    })
  },
  selectDay(ev){//选择指定日期
    console.log(ev.currentTarget.dataset.idx)
    this.setData({
        cur_day: ev.currentTarget.dataset.idx+1
    })
  },
  subSelectDate(){//确定指定的日期
    let data = this.data;
    let taskDay = data.cur_year + '年'+ data.cur_month + '月' + data.cur_day + '日';
    this.setData({
      dayHide: true,
      day: taskDay
    });
  },



  getSystemInfo() {
    try {
      const res = wx.getSystemInfoSync();
      this.setData({
        scrollViewHeight: res.windowHeight * res.pixelRatio || 667
      });
    } catch (e) {
      console.log(e);
    }
  },
  getThisMonthDays(year, month) {//本年
    return new Date(year, month, 0).getDate();
  },
  getFirstDayOfWeek(year, month) {//每月第一天》周
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },
  calculateEmptyGrids(year, month) {
    const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
    let empytGrids = [];
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        empytGrids.push(i);
      }
      this.setData({
        hasEmptyGrid: true,
        empytGrids
      });
    } else {
      this.setData({
        hasEmptyGrid: false,
        empytGrids: []
      });
    }
  },
  calculateDays(year, month) {
    let days = [];

    const thisMonthDays = this.getThisMonthDays(year, month);

    for (let i = 1; i <= thisMonthDays; i++) {
      days.push(i);
    }

    this.setData({
      days
    });
  },
  handleCalendar(e) {
    const handle = e.currentTarget.dataset.handle;
    const cur_year = this.data.cur_year;
    const cur_month = this.data.cur_month;
    if (handle === 'prev') {
      let newMonth = cur_month - 1;
      let newYear = cur_year;
      if (newMonth < 1) {
        newYear = cur_year - 1;
        newMonth = 12;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);

      this.setData({
        cur_year: newYear,
        cur_month: newMonth,
        cur_day: 1
      })

    } else {
      let newMonth = cur_month + 1;
      let newYear = cur_year;
      if (newMonth > 12) {
        newYear = cur_year + 1;
        newMonth = 1;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);

      this.setData({
        cur_year: newYear,
        cur_month: newMonth,
        cur_day: 1
      })
    }
  }
})