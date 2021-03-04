<template>
  <div id="app" :style="{'padding-bottom':musicList.length?'1rem':''}">
    <!-- 头部导航 -->
    <div class="top-bar-fixed" v-show='isFixed'>
      <TopNav :list='topMeunList' ></TopNav>
    </div>
    <div :style="{marginTop:isFixed?'1.016667rem':''}">
       <router-view/>
    </div>
    <!-- 底部播放器 -->
        <Play :musicID='musicID' :misicList='musicList'></Play>
  </div>
</template>
<script>
import TopNav from "./components/TopNav";
import Play from "./components/Play";
export default {
  data() {
    return {
      //头部导航
      topMeunList: [
        { name: "我的", href: "/my" },
        { name: "发现", href: "/" },
        { name: "云村", href: "/my" },
        { name: "视频", href: "/my" }
      ],
      isFixed:true
    };
  },
  computed:{
    musicID(){
      return this.$store.state.musicData.musicID;
    },
    musicList(){
      return this.$store.state.musicData.musicList;
    }
  },
    watch:{
      $route(to){
          if(to.meta.name=='songlist' || to.meta.name=='search' || to.meta.name=='playlist'){
            this.isFixed=false;
          }else{
            this.isFixed=true;
          }
      }
    },
  components: {
    TopNav,
    Play
  },
};
</script>
<style lang="less">
#app {
  background-color: #fcfcfd;
  max-width: 750px;
  margin: 0 auto;
  overflow: hidden;
}
input{
  outline: none;
}
.top-bar-fixed{
  padding: 0 0.166667rem;
  position: fixed;
  box-sizing: border-box;
  max-width: 750px;
  width: 100%;
  background-color: #fcfcfd;
  z-index:99;
}
</style>
