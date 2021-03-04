<template>
    <div class="search-result">
        <!-- 全部 -->
        <div class="item" v-for='(v,k,i) in resultList' :key='i' v-show="$route.meta.type=='searchall'">
            <div class="title">
                <h5>{{k|filtType}}</h5>
                <div class="icon" v-if="k=='song'" @click="playAll">
                    <span class="iconfont icon-icon_play"></span>
                    <span>播放全部</span>
                </div>
            </div>
            <ul v-if="k=='album'">
                <router-link to='' tag='li' v-for="(val,key) in v[k+'s']" :key="key" >
                    <MusicItem mode='type2' :imgSrc="val.picUrl" :name="val.name" :showPlay="k=='song'" :author="val.ar"></MusicItem>
                </router-link>
            </ul>
            <ul v-if="k=='artist'">
                <router-link to='' tag='li' v-for="(val,key) in v[k+'s']" :key="key" >
                    <MusicItem mode='type2' :imgSrc="val.picUrl" :name="val.name" :showPlay="k=='song'" :author="val.ar"></MusicItem>
                </router-link>
            </ul>
            <ul v-if="k=='playList'">
                <router-link :to="{path:'/playlist',name:'PlayList',params:{
             listId:v.id
           }}" tag='li' v-for="(val,key) in v[k+'s']" :key="key" >
                    <MusicItem mode='type2' :imgSrc="val.coverImgUrl" :name="val.name" :showPlay="k=='song'" :author="val.ar"></MusicItem>
                </router-link>
            </ul>
            <ul v-if="k=='song'">
                <li v-for="val in v[k+'s']" :key="val.id" @click='play(val.id)'>
                    <MusicItem mode='type2' :imgSrc="val.al.picUrl" :name="val.name" :author="val.ar" :hide='musicID==val.id'></MusicItem>
                </li>
            </ul>
             <router-link class="more" to='/' tag='p'>{{v.moreText}}></router-link>
             <loading v-if="Object.keys(resultList).length==0"></loading>
        </div>
        <!-- 歌曲 -->
        <div class="box"  v-show="$route.meta.type=='searchsong'">
            <div class="title" @click='playAll'>
                <span class="iconfont icon-icon_play"></span>
                <span>播放全部</span>
            </div>
            <ul>
                <li  v-for="v in songArr" :key="v.id" @click='play(v.id)'>
                    <MusicItem mode='type3'  :name='v.name' :author='v.artists' :hide='v.id==musicID'></MusicItem>
                </li>
            </ul>
             <loading v-if="songArr.length==0"></loading>
          </div>
          <!-- 歌单 -->
          <div class="box"  v-show="$route.meta.type=='searchsonglist'">
            <ul>
                <router-link v-for="v in songListArr" :key="v.id" :to="{path:'/playlist',name:'PlayList',params:{
             listId:v.id
           }}" tag='li'>
                    <MusicItem mode='type2'  :name='v.name' :author='v.artists' :showPlay="false" :imgSrc='v.coverImgUrl' :des="v.description"></MusicItem>
                </router-link>
            </ul>
             <loading v-if="songListArr.length==0"></loading>
          </div>
          <!-- 专辑 -->
           <div class="box"  v-show="$route.meta.type=='searchalbum'">
            <ul>
                <router-link v-for="v in albumArr" :key="v.id" to="/" tag='li'>
                    <MusicItem mode='type2'  :name='v.name'  :showPlay="false" :imgSrc='v.picUrl' :author='v.artists'></MusicItem>
                </router-link>
            </ul>
             <loading v-if="albumArr.length==0"></loading>
          </div>
            <!-- 歌手 -->
          <div class="box"  v-show="$route.meta.type=='searchartist'">
            <ul>
                <router-link v-for="v in artistArr" :key="v.id" to="/" tag='li'>
                    <MusicItem mode='type2'  :name='v.name'  :showPlay="false" :imgSrc='v.picUrl'></MusicItem>
                </router-link>
            </ul>
             <loading v-if="artistArr.length==0"></loading>
          </div>
    </div>
</template>
<script>
import MusicItem from "../components/MusicItem";
import Loading from "../components/Loading";
export default {
  props: {
    keyWord: String,
    data: String
  },
  components: {
    MusicItem,
    Loading
  },
  data() {
    return {
      resultList: {}, //搜索结果对象
      songArr: [], //歌曲数组
      songListArr: [], //歌单数组
      artistArr: [], //歌手数组
      albumArr: [], //专辑数组
      songsId: [] // 歌曲歌单id
    };
  },
  computed: {
    musicID() {
      return this.$store.state.musicData.musicID;
    },
    musicList() {
      return this.$store.state.musicData.musicList;
    }
  },
  methods: {
    jazai(vm) {
      if (vm.$route.meta.type == "searchall") {
        vm.$http("/search?type=1018&keywords=" + vm.keyWord).then(data => {
           vm.songsId = [];
          vm.$set(vm.resultList, "album", data.data.result.album);
          vm.$set(vm.resultList, "artist", data.data.result.artist);
          vm.$set(vm.resultList, "playList", data.data.result.playList);
          vm.$set(vm.resultList, "song", data.data.result.song);
          for (let v of data.data.result.song.songs) {
            vm.songsId.push(v.id);
          }
        });
      } else {
        vm
          .$http("/search?keywords=" + vm.keyWord + "&type=" + vm.data)
          .then(data => {
            if (vm.$route.meta.type == "searchsong") {
               vm.songsId = [];
              vm.songArr = data.data.result.songs;
              for (let v of vm.songArr) {
                vm.songsId.push(v.id);
              }
            } else if (vm.$route.meta.type == "searchsonglist") {
              vm.songListArr = data.data.result.playlists;
            } else if (vm.$route.meta.type == "searchartist") {
              vm.artistArr = data.data.result.artists;
            } else if (vm.$route.meta.type == "searchalbum") {
              vm.albumArr = data.data.result.albums;
            }
          });
      }
    },
    // 播放歌曲
    play(id) {
      this.$store.commit("updateMusicID", id);
      this.$store.commit("play", true);
      // 判断歌曲是否已经存在播放队列中
      if (this.musicList.indexOf(id) == -1) {
        this.$store.commit("updateMusicList", id);
      }
    },
    // 播放全部
    playAll() {
      this.$store.commit("updateMusicList", this.songsId);
       if(this.playType==1){//如果是随机播放
          let s=Math.floor(Math.random()*this.musicList.length);
          this.$store.commit('updateMusicID',this.musicList[s]);
        }else{//如果是顺序播放
            let index=this.musicList.findIndex(v=>v==this.musicID);
            if(index<this.musicList.length-1){
              index++
            }else{
              index=0
            }
            this.$store.commit('updateMusicID',this.musicList[index]);
        }
        this.$store.commit('play',true);
    }
  },
  filters: {
    filtType(v) {
      if (v == "song") {
        return "歌曲";
      } else if (v == "album") {
        return "专辑";
      } else if (v == "artist") {
        return "歌手";
      } else if (v == "playList") {
        return "歌单";
      }
    }
  },
  watch: {
    keyWord() {
      this.jazai(this);
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (vm.keyWord) {
        vm.jazai(vm);
      }
    });
  }
};
</script>
<style lang="less" scoped>
.search-result {
  .item {
    padding: 0.25rem;
    margin-bottom: 0.333333rem;
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      line-height: 1rem;
      .icon {
        color: #c5c5c5;
        font-size: 0.166667rem;
        line-height: 0.5rem;
        padding: 0 0.25rem;
        border-radius: 0.25rem;
        border: 1px solid #d1cece;
      }
    }
    ul {
      li {
        margin-bottom: 0.333333rem;
      }
    }
    .more {
      color: #d1cece;
      font-size: 0.166667rem;
      text-align: center;
    }
  }
  .box {
    padding: 0 0.25rem;
    .title {
      padding: 0.25rem;
      font-size: 0.266667rem;
      .iconfont {
        line-height: 0.6rem;
        width: 0.6rem;
        border-radius: 50%;
        border: 1px solid #c7c7c7;
        color: #000;
        text-align: center;
        margin-right: 0.133333rem;
      }
    }
    ul {
      li {
        margin-top: 0.166667rem;
      }
    }
  }
}
</style>

