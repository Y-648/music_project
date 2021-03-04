<template>
  <div class="discover">
    <!-- 轮播图 -->
    <Swipe :list='swipeList'></Swipe>
    <!-- 导航栏 -->
    <div class="menu-list">
        <ul>
            <router-link :to='`${m.href}`' tag='li' v-for="(m,k) in menuList" :key='k'>
                <span :class="['icon','iconfont',m.icon]"></span>
                <span class="text">{{m.text}}</span>
            </router-link>  
        </ul>
    </div>
    <!-- 推荐歌单 -->
    <div class="tuijian">
      <Title title='推荐歌单' handle='查看更多' href='/songlist'></Title>
      <div class="tuijain-content">
         <ul>
           <router-link  :to="{path:'/playlist',name:'PlayList',params:{
             listId:t.id
           }}" v-for='t in tuijainList' :key='t.id' tag='li'>
              <MusicItem :imgSrc='t.picUrl' :num='t.playCount' :name='t.name' :tag='t.copywriter'></MusicItem>
              </router-link>
         </ul>   
      </div>
    <Loading v-if='tuijainList.length<=0'></Loading>
    </div>
  <!-- 随机不同歌单的不同歌曲 -->
    <div class="hit-song">
      <Title :title='songList.title' handle='播放全部' info='私人定制' icon='icon-icon_play'></Title>
        <ul>
          <li v-for='s in songList.songList' :key='s.id' @click='changeMusicID(s.id)'>
              <MusicItem mode='type2' :name='s.name' :imgSrc='s.picUrl' :author='s.autor' :sq='s.sq' :hide="s.id==musicID"></MusicItem>
          </li>
        </ul>
        <Loading v-if='songList.songList.length<=0'></Loading>
    </div>
  </div>
</template>

<script>
import Swipe from "../components/Swipe";
import Title from "../components/Title";
import MusicItem from "../components/MusicItem";
import Loading from "../components/Loading";
export default {
  name: "Discover",
  components: {
    Swipe,
    Title,
    MusicItem,
    Loading
  },
  data() {
    return {
      //轮播数组
      swipeList: [],
      menuList: [
        { icon: "icon-rili", text: "每日推荐" },
        { icon: "icon-shouyinji", text: "私人FM" },
        { icon: "icon-gedan", text: "歌单",href:'/songlist' },
        { icon: "icon-paixingbang", text: "排行榜" },
        { icon: "icon-zhibo", text: "直播" },
        { icon: "icon-diantai", text: "电台" },
        { icon: "icon-zhuanjigaikuang", text: "数字专辑" }
      ],
      //推荐歌单
      tuijainList: [],
      //取歌单类型的数组
      songListObj: [
        { title: "精选华语金曲", songListId: 2829883282, songList: [] },
        { title: "精选欧美歌曲", songListId: 2829816518, songList: [] },
        { title: "精选日系歌曲", songListId: 2829896389, songList: [] },
        { title: "最懂你的韩系推荐", songListId: 2829920189, songList: [] }
      ],
      songListIds:[],//当前歌单的所有歌曲id
      //当前显示的类型歌单
      currentSongIndex: 0
    };
  },
  computed: {
    songList() {
      return this.songListObj[this.currentSongIndex];
    },
    musicID(){
       return this.$store.state.musicData.musicID;
    }
  },
  methods: {
    // 播放歌曲,传歌曲id,将歌曲加入歌单
    changeMusicID(id){
      this.$store.commit('play',true);
      this.$store.commit('updateMusicID',id);
      this.$store.commit('updateMusicList',this.songListIds);
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      //获取轮播图数组
      vm
        .$http("http://music.kele8.cn/banner?type=2")
        .then(data => {
          vm.swipeList = data.data.banners;
        })
        .catch(err => {
          console.log(err);
        });
      // 获取推荐歌单
      vm
        .$http("http://music.kele8.cn/personalized?limit=6")
        .then(data => {
          vm.tuijainList = data.data.result;
        })
        .catch(err => {
          console.log(err);
        });
      // 获取不同类型的歌单的歌曲显示
      let id = vm.songListObj[vm.currentSongIndex].songListId;
      let songListIdSrc = `/playlist/detail?id=${id}`;
      vm.$http(songListIdSrc)
        .then(data => {
            let songId = data.data.playlist.trackIds.slice(0, 12); //获取歌单的所有音乐的id
            for (let v of songId) {
               vm.$http('/song/detail?ids='+v.id)
              .then(data => {
                vm.songListIds.push(v.id);
                vm.songListObj[vm.currentSongIndex].songList.push(
                  {
                    id:data.data.songs[0].id,
                    name:data.data.songs[0].name,
                    picUrl:data.data.songs[0].al.picUrl,
                    autor:data.data.songs[0].ar,
                    sq:data.data.privileges[0].maxbr
                 }
                );
              }).catch(err=>{
                console.log(err);
              });
            } 
        })
        .catch(err => {
          console.log(err);
        });
    });
  }
};
</script>
<style lang="less" scoped>
.menu-list {
  padding: 0.333333rem 0.25rem;
  overflow-x: auto;
  ul {
    display: flex;
    li {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-right: 0.416667rem;
      flex-shrink: 0;
      .icon {
        height: 1rem;
        width: 1rem;
        color: #fff;
        border-radius: 50%;
        background: #d43c33;
        font-size: 0.5rem;
        text-align: center;
        line-height: 1rem;
        margin-bottom: 0.133333rem;
      }
      .text {
        font-size: 0.266667rem;
        color: rgb(29, 29, 29);
      }
    }
  }
}
.tuijian {
  margin-top: 0.333333rem;
  .tuijain-content {
    overflow-x: auto;
    ul {
      display: flex;
      justify-content: space-between;
      padding: 0.25rem;
      li {
        flex-shrink: 0;
        margin-right: 0.25rem;
        width: 3rem;
      }
    }
  }
}
.hit-song {
  margin-top: 0.333333rem;
  ul {
    padding: 0 0.25rem;
    margin-top: 0.083333rem;
    li {
      width: 92%;
      flex-shrink: 0;
      margin-right: 0.416667rem;
      margin-bottom: 0.25rem;
    }
  }
}
</style>

