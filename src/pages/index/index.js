import Notify from "../../lib/vant-weapp/notify/notify";
/* import Notify from 'path/to/vant-weapp/dist/notify/notify';

Notify('通知内容');
<van-notify id="van-notify" /> */
Page({
  data: {
    income: "",
    bsFive: "",
    exempt: ""
  },
  onChangeIncome(event) {
    this.setData({
      income: event.detail
    });
  },
  handleReset() {
    this.setData({
      money: ""
    });
  },
  onChange5(e) {
    console.log(e);
  },
  onChangeExempt(e) {
    console.log(e);
  },
  handleTip() {
    Notify("实际工资基数: (避税可能导致缴税基数与实际工资有偏差)");
  }
});
