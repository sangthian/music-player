//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    item: 0,
    tab: 0,
    playlist:[
      {
        id: 1, title: 'music 1', src: 'http://localhost:8080/', coverImgUrl: '/images/cover.jpg',
      }
    ],
    // 播放
    state: 'paused',
    playIndex: 0,
    play:{
      currentTime: '00:00',
      duration: '00:00',
      percent: 0,
      title: '',
      singer: '',
      coverImgUrl: '/images/cover.jpg',
    }
  },
  changeItem(e){
    this.setData({
      item: e.target.dataset.item
    })
  },
  changeTab(e){
    this.setData({
      tab: e.detail.current
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true 
    })
  },
  // 实现音乐播放器功能
  audioCtx: null,
  onReady(){
    this.audioCtx = wx.createInnerAudioContext() // 创建播放器实例
    this.setMusic(0)
  },
  setMusic(index){
    let music = this.data.playlist[index]
    this.audioCtx.src = music.src
    this.setData({
      playIndex: index,
      'play.title': music.title,
      'play.singer': music.title,
      'play.coverImgUrl': music.coverImgUrl,
      'play.currentTime': '00:00',
      'play.duration': '00:00',
      'player.percent': 0
    })
  },
  // 播放和暂停事件
  play(){
    this.audioCtx.play()
    this.setData({ state: 'runnning'})
  },
  pause(){
    this.audioCtx.pause()
    this.setData({ state: 'paused'})
  },
  // 下一曲
  next(){
    let index = this.data.playIndex >= this.data.playlist.length -1 ? 0: this.data.playIndex + 1
    this.setMusic(index)
    if (this.data.state === 'running'){
      this.play()
    }
  }
})
