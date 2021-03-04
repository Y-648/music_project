<template>
 <div>
    <ul class="box">
        <router-link :to="{path:'/playlist',name:'PlayList',params:{
             listId:v.id
           }}" tag='li' v-for='v in songList' :key='v.id'>
        <MusicItem :imgSrc='v.coverImgUrl' :num='v.playCount' :name='v.name' :tag='v.tags[0]'></MusicItem>
        </router-link>
    </ul>
    <Loading v-show='pageList.length==0'></Loading>
    <router-link :to='`/songlist/${routerNum}`' v-show="pageList.length!=0 && $route.name=='SongListInfo'" tag='p' class="more">加载更多</router-link>
    </div>
</template>
<script>
import MusicItem from "../components/MusicItem";
import Loading from "../components/Loading";
export default {
  name: "SongListInfo",
  props: ["cat"],
  data() {
    return {
      songList: [],
      pageList: [], //请求的数据
      num: 15, //首次加载歌单的数量
      routerNum: 0
    };
  },
  components: {
    MusicItem,
    Loading
  },
  methods: {
    songMore(vm) {
      let songListSrc = "";
      if (!vm.cat) {
        if (this.songList.length == 0) {
          songListSrc = `/top/playlist?limit=${vm.num}&order=hot`;
        } else {
          songListSrc = `/top/playlist?limit=6&order=hot&offset=${vm.num}`;
        }
      } else {
        songListSrc = `/top/playlist/highquality?cat=${vm.cat}&limit=21`;
      }
      vm.num += 6;
      vm.pageList = [];
      vm
        .$http(songListSrc)
        .then(data => {
          if (data.data.playlists) {
            vm.pageList = data.data.playlists;
            for (let p of vm.pageList) {
              vm.songList.push(p);
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // scrollEvent() {
    //   console.log(document.documentElement.scrollHeight)
    //    if ((document.documentElement.clientHeight + document.documentElement.scrollTop) >= document.documentElement.scrollHeight) {
    //      console.log(111)
    //     // this.$router.push("/songlist/" + this.routerNum);
    //   }
    // }
  },
  beforeRouteEnter(to, from, next) {
    // 默认加载推荐歌单
    next(vm => {
      if (to.params.numlist == undefined) {
        vm.songList = [];
        vm.num = 15;
        vm.routerNum = 0;
      }
      vm.routerNum++;
      vm.songMore(vm);
    });
  },
  beforeRouteUpdate(to, from, next) {
    this.routerNum++;
    this.songMore(this);
    next();
  },
  // mounted() {
  //   // 判断是否触底
  //   window.addEventListener("scroll", this.scrollEvent ,false);
  // },
  // destroyed() {
  //   window.removeEventListener("scroll", this.scrollEvent, false);
  // }
};
</script>
<style lang="less" scoped>
.box {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 0 0.333333rem;
  box-sizing: border-box;
  li {
    width: 30%;
    margin-bottom: 0.333333rem;
  }
}
.more{
text-align: center;
font-size: 0.233333rem;
padding-bottom: 10px;
}
</style>
