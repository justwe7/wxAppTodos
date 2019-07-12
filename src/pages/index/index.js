Page({
  data: {
    money: "",
    income: ""
  },
  onChange(event) {
    this.setData({
      money: event.detail
    });
  },
  handleReset() {
    this.setData({
      money: ""
    });
  },
  handleGetReal() {
    console.log(this.data.money);
  },
  onChangeTab(e) {
    console.log(e);
  },
  handleIncome(e) {
    console.log(e);
    
  }
});
