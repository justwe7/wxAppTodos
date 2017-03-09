var util = require('../../utils/util.js')

Page({
  data: {
    dayHide: true,
    data: {}
  },
  onLoad: function (option) {
    let self = this;
    let id = option.id;
    let AllDatas = wx.getStorageSync('tasksData');
    AllDatas.map(function(obj) {
      if(obj.id == id) {
        wx.setNavigationBarTitle({
          title: obj.value
        });
        self.setData({
          data: obj
        });
      }
    })
  },
  changeStatus: function(e){//改变任务状态
    let AllDatas = wx.getStorageSync('tasksData');
    let index = e.target.dataset.index;//当前点击的对象在全局列表中的index
    let thisData = this.data.data;
    thisData.finshed = !thisData.finshed;

    AllDatas.map(function(obj){
      if(obj.id == index){
        obj.finshed = !obj.finshed;
      }
    });
    /*for (var i = 0; i < AllDatas.length; i++) {
        if(AllDatas[i].id == index){
          AllDatas[i] = thisData
        }
    }*/

    this.setData({
      data: thisData
    });
    wx.setStorageSync('tasksData', AllDatas);
  },
  addDetail: function(e){
    let AllDatas = wx.getStorageSync('tasksData');
    let thisData = this.data.data;
    
    let val = e.detail.value.trim()
    if(val){//有内容
      AllDatas.map(function(obj) {
        if(obj.id == thisData.id) {
          thisData.nocontent = false;
          thisData.content = val;
          obj.nocontent = false;
          obj.content = val;
        }
      })
    }else{
      AllDatas.map(function(obj) {
        if(obj.id == thisData.id) {
          thisData.nocontent = true;
          thisData.content = '';
          obj.nocontent = true;
          obj.content = '';
        }
      })
    }
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
    this.aniShow();
  },
  hideSelectDate(){//隐藏选择日期
    this.setData({
      dayHide: true
    })
    this.aniHide();
  },
  selectDay(ev){//选择指定日期
    this.setData({
        cur_day: ev.currentTarget.dataset.idx+1
    })
  },
  subSelectDate(e){//确定指定的日期
    let data = this.data;
    let taskDay = data.cur_year + '/'+ data.cur_month + '/' + data.cur_day;
    this.setData({
      dayHide: true,
      day: taskDay,
    });
    this.aniHide();
    
    let AllDatas = wx.getStorageSync('tasksData');
    let index = e.target.dataset.index;//当前点击的对象在全局列表中的index
    let thisData = this.data.data;

    AllDatas.map(function(obj){
      if(obj.id == index){
        obj.day = taskDay;
      }
    });
    /*for (var i = 0; i < AllDatas.length; i++) {
        if(AllDatas[i].id == index){
          AllDatas[i] = thisData
        }
    }*/
    wx.setStorageSync('tasksData', AllDatas);
  },
  aniShow(){
    var animation = wx.createAnimation({
      duration: 300
    })
    this.animation = animation
    animation.opacity(1).step();
    this.setData({
      animationData:animation.export()
    })
  },
  aniHide(){
    var animation = wx.createAnimation({
      duration: 300
    })
    this.animation = animation
    animation.opacity(0).step();
    this.setData({
      animationData:animation.export()
    })
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
