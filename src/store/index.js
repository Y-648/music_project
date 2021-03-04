import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    musicData:{
      musicID:0,//音乐id
      musicList:[],//播放列表
      isPlay:false,//是否播放
      isFull:false,//是否显示全屏的播放器
      playType:1,//播放方式，默认1为随机播放,2为顺序播放,3为循环播放
    }
  },
  mutations: {
    // 改变音乐id
    updateMusicID(state,id){
      state.musicData.musicID=id;
    },
    // 改变播放状态
    play(state,status){
      state.musicData.isPlay=status;
    },
    // 改变播放列表
    updateMusicList(state,list){
      if(list instanceof Array){
        state.musicData.musicList=[...list];
      }else{
        state.musicData.musicList.push(list);
      }
    },
    // 改变播放方式
    updatePlayType(state){
        if(state.musicData.playType==1){
          state.musicData.playType=2
        }else if(state.musicData.playType==2){
          state.musicData.playType=3
        }else{
          state.musicData.playType=1
        }
    },
    // 是否全屏
    toogleFull(state,status){
      state.musicData.isFull=status;
    }
  },
  actions: {
  },
  modules: {
  }
})
