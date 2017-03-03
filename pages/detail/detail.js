var util = require('../../utils/util.js')

Page({
  data: {
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
  }
})
