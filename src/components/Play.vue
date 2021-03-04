<template>
    <div class="play" v-show="musicList.length">
         <audio :src="musicID?`https://music.163.com/song/media/outer/url?id=${musicID}.mp3`:''" controls ref="audio" @timeupdate='updateTime' autoplay="autoplay"  @canplay="getDuration"
         v-show='false' @ended='end'>你的浏览器不支持audio</audio>
         <!-- 底部播放器 -->
            <div class="mini" @click="showFull">
                <img :src="musicInfo.pic" :class="{cover:!isPlay}">
                <div class="info">
                    <p class="name">{{musicInfo.name}}</p>
                    <p class="lyric"><span v-if='musicInfo.ar.length'>{{musicInfo.ar[0].name}}</span><span v-if='musicInfo.ar[1]'>/{{musicInfo.ar[1].name}}</span></p>
                </div>
                <div class="paly-btn">
                    <canvas width="50" height="50" ref="canvas"></canvas>
                    <span class="iconfont" @click.stop="changePlayStatus" :class="isPlay?'icon-zantingtingzhi':'icon-bofang'"></span>
                </div>
                <span class="list iconfont icon-liebiao" @click.stop="showList"></span>
            </div>
            <!-- 遮罩层 -->
            <div class="shade" v-show='showMusicList' @click="hideList"></div>
            <!-- 播放列表 -->
            <div class="music-list" v-show='showMusicList'>
                <h4>当前播放({{musicListInfo.length}})</h4>
                <div class="title">
                    <div class="icon" @click='changeType'>
                        <span class="iconfont" :class="playType==1?'icon-suiji':playType==2?'icon-shunxubofang':'icon-loop-3'"></span>
                        <span class="type">{{playType==1?'随机播放':playType==2?'顺序播放':'单曲循环'}}</span>
                    </div>
                    <span class="iconfont icon-shanchu" @click="clear"></span>
                </div>
                <ul>
                    <li v-for='v in musicListInfo' :key='v.id' @click='changeMusic(v.id)'>
                         <MusicItem mode='type3' :name='v.name' :author='v.ar' :hide='v.id==musicID'></MusicItem>
                    </li>
                </ul>
            </div>
            <!-- 全屏播放器 -->
            <div class="full-play" v-show='isFull'>
              <!-- <div class="bg" :style="{background:`url(${musicInfo.pic}?imageView&thumbnail=50y50&quality=15&tostatic=0)`}"></div> -->
                <div class="title-box">
                <span class="iconfont icon-fanhui" @click="hideFull"></span>
                <div class="title">
                    <p class="name">{{musicInfo.name}}</p>
                     <p class="ar"><span v-if='musicInfo.ar.length'>{{musicInfo.ar[0].name}}</span><span v-if='musicInfo.ar[1]'>/{{musicInfo.ar[1].name}}</span></p>
                </div>
                <span class="iconfont icon-fenxiang"></span>
                </div>
                <div class="content">
                <div class="disc" v-show='showDisc' @click="hideDisc">
                    <div class="black-box">
                        <div class="img-box">
                            <img :src="musicInfo.pic" alt="" :class="isPlay?'':'stop'">
                        </div>
                    </div>
                </div>
                <!-- 歌词 -->
                <div class="lyric-box" v-show='!showDisc'>
                    <div class="volume-box">
                      <span class="iconfont icon-yinliang"></span>
                      <div class="progress-box" @click="changeVolume" ref='volume'>
                        <div class="progress" :style="{width:volume+'%'}"></div>
                        <div class="slider-bar" :style="{left:volume+'%'}"></div>
                      </div>
                    </div>
                    <div class="lyric">
                      <span v-if='!isLyc' class="none">暂时没有歌词</span>
                      <Loading v-if='musicInfo.lyric.length==0 && isLyc'></Loading>
                      <ul v-if='isLyc' :style="{marginTop:ulTop}" :class="isDrag?'':'tran'" @touchstart='lycStart' @touchmove.prevent='lycMove' @touchend='lycEnd'>
                        <li v-for='(m,k) in musicInfo.lyric' :key='k' :class="{active:currentIndex==k}">{{m.lyc}}</li>
                      </ul>
                    </div>
                </div>
                </div>
                <div class="bottom-btn">
                     <div class="status">
                        <span class="begin-time">{{currentTime}}</span>
                        <div class="progress-box" @click="changeProgress" ref='progress'>
                        <div class="progress" :style="{width:progressWidth+'%'}"></div>
                        <div class="slider-bar" :style="{left:progressWidth+'%'}"></div>
                         </div>
                        <span class="end-time">{{fullTime}}</span>
                   </div>
                   <div class="control-btn">
                       <span class="iconfont" :class="playType==1?'icon-suiji':playType==2?'icon-shunxubofang':'icon-loop-3'" @click='changeType'></span>
                            <div class="icon">
                                <span class="iconfont icon-shangyishou1" @click="prev"></span>
                                <span class="iconfont bo" @click="changePlayStatus" :class="isPlay?'icon-zantingtingzhi':'icon-bofang'"></span>
                                <span class="iconfont icon-shangyishou" @click="next"></span>
                            </div>
                       <span class="iconfont icon-liebiao" @click="showList" ></span>
                   </div>
                </div>
            </div>
    </div>
</template>
<script>
import MusicItem from "./MusicItem";
import Loading from "./Loading";
// import { mapState } from "vuex";
export default {
  props: ["musicID", "misicList"],
  data() {
    return {
      musicInfo: {
        name: "", //歌曲名字
        pic: "", //歌曲图片
        lyric: [], //歌词数组
        ar: [] //歌手
      }, //当前播放的音乐信息对象
      currentIndex: 0, //当前播放的歌词
      isLyc: true, //是否有歌词
      currentTime: "00:00", //当前播放时间
      musicListInfo: [], //播放队列数组的歌曲信息
      fullTime: 0, //总时长
      ulTop: 0, //歌词滚动距离
      volume: 50, //音量大小
      showMusicList: false, //   显示和隐藏播放列表
      progressWidth: 0, //播放进度
      showDisc: true, //是否显示碟片
      prevIds: [], //存放上一首的数组
      isDrag: false, //是否可以拖动
      autoMove: true, //是否自动滚动
      startY: 0, // 手指按下的初始y位置
      startX: 0, // 手指按下的初始x位置
      timer: null, //定时器
      offsetTop: 0 //按下时歌词的偏移距离
    };
  },
  components: {
    MusicItem,
    Loading
  },
  methods: {
    // 画圆
    drawCircle(c, d) {
      if (this.$refs.canvas) {
        let canvas = this.$refs.canvas;
        let cxt = canvas.getContext("2d"); //上下文
        cxt.clearRect(0, 0, c.width, c.height); //清空画布
        cxt.beginPath();
        cxt.strokeStyle = "#383636";
        cxt.lineWidth = 2;
        cxt.arc(25, 25, 15.5, 0, Math.PI * 2);
        cxt.stroke();
        cxt.closePath();

        cxt.beginPath();
        cxt.lineWidth = 2;
        cxt.strokeStyle = "#d43c33";
        cxt.arc(
          25,
          25,
          15.5,
          -Math.PI / 2,
          -Math.PI / 2 + Math.PI * 2 * (c / d)
        );
        cxt.stroke();
        cxt.closePath();
      }
    },
    // 显示播放列表
    showList() {
      this.showMusicList = true;
    },
    // 隐藏播放列表
    hideList() {
      this.showMusicList = false;
    },
    //播放进度改变
    updateTime(e) {
      let currentTime = e.target.currentTime;
      //   格式化当前时间
      this.currentTime = this.formatTime(currentTime);
      let fullTime = e.target.duration;
      //   改变进度条
      this.progressWidth = currentTime / fullTime * 100;
      this.drawCircle(currentTime, fullTime);
      // 改变歌词滚动
      for (let i = 0; i < this.musicInfo.lyric.length; i++) {
        if (
          i == this.musicInfo.lyric.length - 1 &&
          currentTime >= this.musicInfo.lyric[i].time
        ) {
          this.currentIndex = i;
          break;
        }
        if (
          currentTime >= this.musicInfo.lyric[i].time &&
          currentTime < this.musicInfo.lyric[i + 1].time
        ) {
          this.currentIndex = i;
          break;
        }
      }
      if (this.autoMove) {
        if (this.currentIndex > 4) {
          this.ulTop = -(1 * (this.currentIndex - 4)) + "rem";
        }else{
          this.ulTop = 0;
        }
      }
    },
    // 显示歌词
    hideDisc() {
      this.showDisc = false;
    },
    // 显示歌词
    disc() {
      this.showDisc = true;
    },
    // 显示全屏播放器
    showFull() {
      this.$store.commit("toogleFull", true);
    },
    // 隐藏全屏播放器
    hideFull() {
      this.$store.commit("toogleFull", false);
      this.disc();
    },

    //切换音乐
    changeMusic(id) {
      this.prevIds.push(this.musicID);
      this.$store.commit("updateMusicID", id);
      this.$store.commit("play", true);
    },
    // 清空播放列表
    clear() {
      this.$store.commit("updateMusicList", []);
      this.$store.commit("play", false);
      this.showMusicList = false;
      this.$store.commit("toogleFull", false);
    },
    //格式化时间的方法
    formatTime(time) {
      let minutes =
        parseInt(time / 60) < 10
          ? "0" + parseInt((time / 60) % 60)
          : parseInt(time / 60);
      let seconds =
        parseInt(time % 60) < 10
          ? "0" + parseInt(time % 60)
          : parseInt(time % 60);
      return minutes + ":" + seconds;
    },
    //获取总时长和音量
    getDuration() {
      this.$refs.audio.volume = this.volume / 100;
      this.fullTime = this.formatTime(this.$refs.audio.duration);
    },
    //改变全局的播放状态
    changePlayStatus() {
      if (this.$refs.audio.paused) {
        this.$refs.audio.play();
        this.$store.commit("play", true);
      } else {
        this.$refs.audio.pause();
        this.$store.commit("play", false);
      }
    },
    //点击改变进度
    changeProgress(e) {
      if (e.target.className != "slider-bar") {
        this.progressWidth = e.offsetX / this.$refs.progress.offsetWidth * 100;
        //改变视频进度
        this.$refs.audio.currentTime =
          this.$refs.audio.duration * this.progressWidth / 100;
        this.$store.commit("play", true);
      }
    },
    //点击改变音量
    changeVolume(e) {
      if (e.target.className != "slider-bar") {
        this.volume = parseInt(e.offsetX / this.$refs.volume.offsetWidth * 100);
      }
    },
    // 改变播放方式
    changeType() {
      this.$store.commit("updatePlayType");
    },
    // 上一首
    prev() {
      if (this.playType != 3) {
        if (this.prevIds.length != 0) {
          this.$store.commit(
            "updateMusicID",
            this.prevIds[this.prevIds.length - 1]
          );
          this.prevIds.pop();
        } else {
          let s = Math.floor(Math.random() * this.musicList.length);
          this.$store.commit("updateMusicID", this.musicList[s]);
        }
      } else {
        this.$refs.audio.currentTime = 0;
      }
    },
    // 下一首
    next() {
      //将该歌曲存到上一首数组
      this.prevIds.push(this.musicID);
      if (this.playType == 1) {
        //如果是随机播放
        let s = Math.floor(Math.random() * this.musicList.length);
        this.$store.commit("updateMusicID", this.musicList[s]);
      } else if (this.playType == 2) {
        //如果是顺序播放
        let index = this.musicList.findIndex(v => v == this.musicID);
        if (index < this.musicList.length - 1) {
          index++;
        } else {
          index = 0;
        }
        this.$store.commit("updateMusicID", this.musicList[index]);
      }
      // 重头播放
      this.$refs.audio.currentTime = 0;
      // 歌词回到起始位置
      this.ulTop = 0;
      this.currentIndex=0;
      this.$store.commit("play", true);
      this.$nextTick(() => {
        this.$refs.audio.play();
      });
    },
    // 播放完成之后
    end() {
      this.next();
    },
    // 开始拖动歌词
    lycStart(e) {
      this.isDrag = true;
      this.autoMove = false;
      this.startY = e.targetTouches[0].pageY;
      this.offsetTop = (this.ulTop + "").includes("rem")
        ? parseFloat(this.ulTop) * 60
        : parseFloat(this.ulTop);
    },
    // 拖动中
    lycMove(e) {
      if (this.isDrag) {
        let s = e.targetTouches[0].pageY - this.startY;
        this.ulTop = parseFloat(this.offsetTop) + s + "px";
        this.ulTop =
          parseFloat(this.ulTop) > 0
            ? 0 + "px"
            : parseFloat(this.ulTop) <
              -(this.musicInfo.lyric.length * 60 - 4 * 60)
              ? -(this.musicInfo.lyric.length * 60 - 4 * 60) + "px"
              : this.ulTop;
      }
    },
    // 拖动结束
    lycEnd() {
      this.isDrag = false;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.autoMove = true;
      }, 2000);
    }
  },
  computed: {
    isPlay() {
      return this.$store.state.musicData.isPlay; //全局的播放状态
    },
    musicList() {
      return this.$store.state.musicData.musicList; //全局的播放列表
    },
    isFull() {
      return this.$store.state.musicData.isFull; //全屏播放属性
    },
    playType() {
      return this.$store.state.musicData.playType; //播放方式
    }
    // ...mapState(['isPlay','isFull']) //全局的播放状态,播放列表,播放属性
  },
  mounted() {
    this.drawCircle(0, 0);
  },
  watch: {
    //   监听音乐id变化,请求数据
    musicID() {
      // 停止上一次请求
      // this.cancelQuest();
      //  const _this = this;
       this.musicInfo= {
        name: "", 
        pic: "", 
        lyric: [], 
        ar: []
      }, //清空当前播放的音乐信息对象
      // 请求歌曲详情
      this.$http("/song/detail?ids=" + this.musicID).then(data => {
        let result = data.data.songs[0];
        this.musicInfo.name = result.name;
        this.musicInfo.pic = result.al.picUrl;
        this.musicInfo.ar = result.ar;
         // 请求歌词
         this.isLyc = true;
      this.$http("http://music.kele8.cn/lyric?id=" + this.musicID)
        .then(data => {
          if (!data.data.lrc) {
            this.isLyc = false;
            return;
          }
          this.isLyc = true;
          let lyc = data.data.lrc.lyric.split("\n");
          lyc.pop();
          let lycReg = /\[(\d+):(\d+\.\d+)\](.*)/;
          let newLyc = lyc.map(v => {
            lycReg.test(v);
            return {
              time: parseInt(RegExp.$1) * 60 + parseFloat(RegExp.$2),
              lyc: RegExp.$3
            };
          });
          this.musicInfo.lyric = newLyc.filter(v => v.lyc!= "");
        })
        .catch(err => {
          this.isLyc = false;
          console.log(err);
        });
      });
       // 歌词回到起始位置
          this.ulTop = 0;
    },
    // 监听播放列表变化
    musicList() {
      this.musicListInfo = [];
      for (let v of this.musicList) {
        this.$http("/song/detail?ids=" + v).then(data => {
          let result = data.data.songs[0];
          this.musicListInfo.push({
            id: result.id,
            name: result.name,
            ar: result.ar
          });
        });
      }
    },
    // 监听播放状态
    isPlay() {
      this.$nextTick(() => {
        if (this.isPlay) {
          this.$refs.audio.play();
        } else {
          this.$refs.audio.pause();
        }
      });
    },
    // 监听音乐音量变化
    volume() {
      this.$refs.audio.volume = this.volume / 100;
    }
  }
};
</script>
<style lang="less" scoped>
.play {
  @keyframes move {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  // 底部播放器
  .mini {
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 100;
    max-width: 750px;
    background: #fff;
    border-top: 1px solid rgb(139, 138, 138);
    display: flex;
    padding: 0.116667rem;
    align-items: center;
    justify-content: space-between;
    img {
      height: 0.833333rem;
      width: 0.833333rem;
      border-radius: 50%;
      margin-right: 0.133333rem;
      animation: move 2s linear infinite;
      &.cover {
        animation-play-state: paused;
      }
    }
    .info {
      padding: 0.083333rem 0;
      box-sizing: border-box;
      height: 0.833333rem;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .name {
        font-size: 0.233333rem;
        color: #383636;
      }
      .lyric {
        font-size: 0.2rem;
        color: rgb(163, 157, 157);
      }
    }
    .paly-btn {
      position: relative;
      margin: 0 0.25rem;
      font-size: 0.2rem;
      .iconfont {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .list {
      font-size: 0.666667rem;
      color: #383636;
    }
  }
  //   遮罩层
  .shade {
    position: fixed;
    bottom: 0;
    z-index: 105;
    height: 100vh;
    width: 100vw;
    max-width: 750px;
    background: #aaa8a8;
    opacity: 0.4;
  }
  //   播放列表
  .music-list {
    position: fixed;
    bottom: 10vh;
    left: 50%;
    transform: translateX(-50%);
    max-width: 675px;
    background: #fff;
    z-index: 106;
    height: 6.666667rem;
    width: 90%;
    border-radius: 0.25rem;
    padding: 0.333333rem 0.166667rem 0;
    h4 {
      font-size: 0.333333rem;
      height: 0.666667rem;
      line-height: 0.666667rem;
    }
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.266667rem;
      color: #616161;
      .icon {
        .iconfont {
          color: #9c9c9c;
          font-size: 0.333333rem;
          margin-left: 0.083333rem;
        }
      }
      .iconfont {
        color: #9c9c9c;
        font-size: 0.333333rem;
      }
    }
    ul {
      overflow-y: auto;
      max-height: 5rem;
    }
  }
  //   全屏播放器
  .full-play {
    height: 100vh;
    width: 100%;
    max-width: 750px;
    position: fixed;
    bottom: 0;
     background: #302f3f;
    z-index: 101;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
//     .bg{
//       position: absolute;
// // background: #302f3f;
// background-size: auto 100% !important;
// height: 100%;
// width: 100%;
// filter: blur(5px);
// z-index: -2;
//     }
    .title-box {
      display: flex;
      padding: 0.166667rem 0.25rem;
      justify-content: space-between;
      align-items: center;
      .iconfont {
        color: #fff;
        font-size: 0.466667rem;
      }
      .title {
        flex: 1;
        overflow: hidden;
        margin: 0 0.25rem;
        .name {
          color: #fff;
          font-size: 0.333333rem;
        }
        .ar {
          color: #7a777c;
          font-size: 0.266667rem;
          display: block;
        }
      }
    }
    .content {
      flex: 1;
      overflow: hidden;
      position: relative;
      .disc {
        height: 5.833333rem;
        width: 5.833333rem;
        border-radius: 50%;
        background: #4c484b;
        margin: 0.833333rem auto 0;
        // transform-style: preserve-3d;
        // transition: transform 2s;
        // &:hover{
        //  transform: translateX(7.5rem)
        // }
        .black-box {
          position: relative;
          top: 0.083333rem;
          height: 5.666667rem;
          width: 5.666667rem;
          border-radius: 50%;
          background: #111113;
          margin: 0 auto;
          .img-box {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            height: 3.333333rem;
            width: 3.333333rem;
            border-radius: 50%;
            overflow: hidden;
            box-shadow: 2px 2px 5px #000;
            img {
              animation: move 4s linear infinite;
              width: 100%;
              height: 100%;
              &.stop {
                animation-play-state: paused;
              }
            }
          }
        }
      }
      .lyric-box {
        .volume-box {
          display: flex;
          padding: 0.333333rem 0.5rem 0.5rem;
          align-items: center;
          .iconfont {
            font-size: 0.266667rem;
            color: #fff;
            margin-right: 0.333333rem;
          }
          .progress-box {
            flex: 1;
            height: 0.05rem;
            background: #565658;
            margin: 0 0.166667rem;
            position: relative;
            .progress {
              width: 0%;
              background: #d43c33;
              height: 100%;
            }
            .slider-bar {
              position: absolute;
              background: #fff;
              height: 0.116667rem;
              width: 0.116667rem;
              border-radius: 50%;
              top: 50%;
              transform: translateY(-50%);
            }
          }
        }
        .lyric {
          overflow: hidden;
          .none {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #fff;
            font-size: 0.266667rem;
            border: 1px solid rgb(107, 103, 103);
          }
          ul {
            &.tran {
              transition: all 0.5s linear;
            }
            li {
              color: #fff;
              font-size: 0.266667rem;
              line-height: 1rem;
              text-align: center;
              &.active {
                color: #d43c33;
              }
            }
          }
        }
      }
    }

    .bottom-btn {
      .status {
        display: flex;
        padding: 0.5rem 0.25rem;
        align-items: center;
        justify-content: space-between;
        .begin-time,
        .end-time {
          color: #fff;
          font-size: 0.2rem;
        }
        .progress-box {
          flex: 1;
          height: 0.033333rem;
          background: #565658;
          margin: 0 0.166667rem;
          position: relative;
          .progress {
            background: #d43c33;
            height: 100%;
          }
          .slider-bar {
            position: absolute;
            background: #fff;
            height: 0.083333rem;
            width: 0.083333rem;
            border-radius: 50%;
            top: 50%;
            transform: translateY(-50%);
          }
        }
      }
      .control-btn {
        display: flex;
        padding: 0 0.333333rem 0.333333rem;
        justify-content: space-between;
        align-items: center;
        .iconfont {
          color: #fff;
          font-size: 0.583333rem;
        }
        .icon {
          .iconfont {
            color: #fff;
            font-size: 0.333333rem;
          }
          .bo {
            display: inline-block;
            margin: 0 0.666667rem;
            height: 0.833333rem;
            line-height: 0.833333rem;
            width: 0.833333rem;
            border-radius: 50%;
            border: 1px solid #fff;
            text-align: center;
          }
        }
      }
    }
  }
}
</style>
