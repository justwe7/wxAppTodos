Page({
  data: {
    money: ''
  },
  onChange(event) {
    this.setData({
      money: event.detail
    })
  },
  handleReset() {
    this.setData({
      money: ""
    })
  },
  handleGetReal() {
    console.log(this.data.money)
  }
})