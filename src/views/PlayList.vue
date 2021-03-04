<template>
    <div class="palylist">
        <div v-if='!isErr'>
        <div class="menu">
         <div class="top">
            <span class="icon iconfont icon-fanhui"  tag='span' @click='back'></span>
            <span class="title">歌单</span>
        </div>
        <div class="content">
            <div class="img-box">
                <img :src="playlistInfo.pic" alt="">
                <div class="num-box">
                    <span class="iconfont icon-bofang"></span>
                    <span class="num">{{playlistInfo.playCount|formatNum}}</span>
                </div>
            </div>
            <div class="ringth-box">
                <div class="title">{{playlistInfo.name}}</div>
                <div class="autor-box">
                   <img :src="playlistInfo.avatarUrl" alt="">
                   <span class="autor">{{playlistInfo.arname}}</span>
                   <span class="iconfont icon-xiayige"></span>
                </div>
                <div class="introduce">
                   <span class="des">介绍:{{playlistInfo.playCount}}</span><span class="iconfont icon-xiayige"></span>
                </div>
            </div>
        </div>
        <div class="list-box">
            <ul>
                <li>
                    <span class="iconfont icon-pinglun"></span>
                    <span class="name">{{playlistInfo.commentCount}}</span>
                </li>
                 <li>
                    <span class="iconfont icon-fenxiang"></span>
                    <span class="name">{{playlistInfo.shareCount}}</span>
                </li>
                 <li>
                    <span class="iconfont icon-xiazai"></span>
                    <span class="name">下载</span>
                </li>
                 <li>
                    <span class="iconfont icon-duoxuanxuanzhong"></span>
                    <span class="name">多选</span>
                </li>
            </ul>
        </div>
        </div>
        <div class="songslist">
            <div class="title">
                <span class="iconfont icon-bofang1"></span>
                <div class="playall" @click="playAll">
                    播放全部<span class="num">( 共{{playlistInfo.num}}首 )</span>
                </div>
            </div>
            <Loading v-show='playlistInfo.songList.length==0'></Loading>
            <div :style="{height:musicList.length==0?'85%':'72%'}" class="songs">
            <ul>
                <li v-for='(v,k) in playlistInfo.songList' :key='v.id' @click="play(v.id)">
                    <MusicItem mode='type3' :name='v.name' :author="v.ar"  :order="k+1" :des='v.des' :sq='v.sq' :hide='v.id==musicID'></MusicItem>
                </li>
            </ul>
            <p class="more" @click="songsMore" v-if='!isEnd'>加载更多</p>
            <p class="more"  v-if='isEnd'>没有更多了~</p>
            <loading v-show='moreArr.length==0 && isMore && !isEnd'></loading>
            </div>
        </div>
        </div>
        <div v-if="isErr">
        <span class="icon iconfont icon-fanhui"  tag='span' @click='back'></span>
        <span>找不到资源</span>
        </div>
    </div>
</template>
<script>
import MusicItem from "../components/MusicItem";
import Loading from "../components/Loading";
export default {
  props: ["listId"],
  data() {
    return {
      playlistInfo: {
        pic: "", //歌单图片
        name: "", //歌单名字
        des: "", //描述
        num: 0, // 歌曲总数
        allSongsId: [], //所有歌曲id
        playCount: 0, //播放量
        shareCount: 0, //分析次数
        commentCount: 0, //评论数量
        avatarUrl: "", //作者头像
        arname: "", //作者名字
        songList: [] //歌曲数组
      }, //歌单详情
      isErr: false, //歌曲是否能请求
      idsArr: [], //需要加入播放列表的歌曲id
      fristNum: 20, //首次加载数量,
      moreArr: [], // 加载数组
      isMore: false ,//是否加载
      isEnd:false//是否加载完成
    };
  },
  filters: {
    formatNum(value) {
      return (value / 1000).toFixed(1) + "万";
    }
  },
  methods: {
    back() {
      this.$router.back();
    },
    play(id) {
      this.$store.commit("updateMusicID", id);
      this.$store.commit("updateMusicList", this.idsArr);
      this.$store.commit("play", true);
    },
    playAll() {
      this.$store.commit("updateMusicList", this.idsArr);
      if (this.playType == 1) {
        //如果是随机播放
        let s = Math.floor(Math.random() * this.musicList.length);
        this.$store.commit("updateMusicID", this.musicList[s]);
      } else {
        //如果是顺序播放
        let index = this.musicList.findIndex(v => v == this.musicID);
        if (index < this.musicList.length - 1) {
          index++;
        } else {
          index = 0;
        }
        this.$store.commit("updateMusicID", this.musicList[index]);
      }
      this.$store.commit("play", true);
    },
    //请求歌曲详情的方法
    getSongInfo(vm, arr) {
      for (let v of arr) {
        vm
          .$http("/song/detail?ids=" + v.id)
          .then(data => {
            //将歌曲加入播放队列
            vm.idsArr.push(v.id);
            vm.moreArr.push(v.id);
            let s = data.data.songs[0];
            // 获取歌曲详情
            vm.playlistInfo.songList.push({
              id: s.id,
              name: s.name,
              ar: s.ar,
              des: s.alia[0],
              sq: data.data.privileges[0].maxbr
            });
            vm.isMore = false;
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    // 加载更多
    songsMore() {
      this.moreArr = [];
      this.isMore = true;
      let ids = this.allSongsId.slice(
        this.fristNum + 1,
        this.fristNum + 1 + 10
      );
      if (ids.length == 0) {
        this.isEnd = true;
      } else {
        this.isEnd = false;
        this.getSongInfo(this, ids);
        this.fristNum += 10;
      }
    }
  },
  computed: {
    musicList() {
      return this.$store.state.musicData.musicList;
    },
    musicID() {
      return this.$store.state.musicData.musicID;
    }
  },
  components: {
    MusicItem,
    Loading
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$http("/playlist/detail?id=" + vm.listId).then(data => {
        if (!data.data.playlist) {
          vm.isErr = true;
          return;
        }
        let result = data.data.playlist;
        vm.playlistInfo.pic = result.coverImgUrl;
        vm.playlistInfo.name = result.name;
        vm.playlistInfo.des = result.description;
        vm.playlistInfo.playCount = result.playCount;
        vm.playlistInfo.shareCount = result.shareCount;
        vm.playlistInfo.commentCount = result.commentCount;
        vm.playlistInfo.avatarUrl = result.creator.avatarUrl;
        vm.playlistInfo.arname = result.creator.nickname;
        vm.playlistInfo.num = result.trackIds.length;
        vm.allSongsId = result.trackIds; //所有歌曲id
        let ids = result.trackIds.slice(0, vm.fristNum); //加载歌曲id
        vm.getSongInfo(vm, ids);
      });
    });
  }
};
</script>
<style lang="less" scoped>
.palylist {
  .menu {
    background: #230f11;
    padding-bottom: 0.666667rem;
    .top {
      font-size: 0.433333rem;
      font-weight: bold;
      color: #fff;
      padding: 0.416667rem;
      .icon {
        font-size: 0.466667rem;
        margin-right: 0.333333rem;
      }
    }
    .content {
      display: flex;
      padding: 0.25rem 0.833333rem;
      .img-box {
        height: 2.666667rem;
        width: 2.666667rem;
        margin-right: 0.5rem;
        position: relative;
        img {
          width: 100%;
          height: 100%;
        }
        .num-box {
          position: absolute;
          font-size: 0.233333rem;
          color: #a3a2a4;
          right: 0.066667rem;
          top: 0.066667rem;
          text-shadow: 1px 1px 2px #000;
          .iconfont {
            font-size: 0.233333rem;
            color: #a3a2a4;
          }
        }
      }
      .ringth-box {
        flex: 1;
        .title {
          color: #fff;
          font-weight: bold;
          font-size: 0.4rem;
          margin-bottom: 0.166667rem;
          overflow: hidden;
          max-width: 5rem;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .autor-box {
          display: flex;
          align-items: center;
          margin-bottom: 0.333333rem;
          img {
            width: 0.833333rem;
            height: 0.833333rem;
            border-radius: 50%;
            margin-right: 0.166667rem;
          }
          .autor {
            font-size: 0.266667rem;
            color: #b1aaa9;
            margin-right: 0.083333rem;
          }
          .iconfont {
            font-size: 0.266667rem;
            color: #a09d9d;
          }
        }
        .introduce {
          font-size: 0.233333rem;
          color: #a09d9d;
          display: flex;
          overflow: hidden;
          .des {
            max-width: 70%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .iconfont {
            font-size: 0.233333rem;
            color: #a09d9d;
            margin-left: 0.083333rem;
          }
        }
      }
    }
    .list-box {
      margin-top: 0.333333rem;
      font-size: 0.233333rem;
      color: #c0bdbe;
      ul {
        display: flex;
        justify-content: space-between;
        align-items: center;
        li {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          .iconfont {
            color: #c0bdbe;
            font-size: 0.5rem;
            margin-bottom: 0.083333rem;
          }
        }
      }
    }
  }
  .songslist {
    background: #fff;
    position: fixed;
    bottom: 0;
    top: 6.166667rem;
    width: 100%;
    border-radius: 0.333333rem 0.333333rem 0 0;
    .title {
      display: flex;
      color: #000;
      font-size: 0.4rem;
      padding: 0.333333rem;
      align-items: center;
      .iconfont {
        color: #000;
        font-size: 0.4rem;
        margin-right: 0.333333rem;
      }
      .playall {
        .num {
          font-size: 0.333333rem;
          color: #b7b7b7;
        }
      }
    }
    .songs {
      overflow-y: auto;
      .more {
        text-align: center;
        font-size: 0.233333rem;
        padding-bottom: 10px;
      }
    }
  }
}
</style>
