<template>
    <div class="song-list">
        <div class="menu">
        <div class="top">
            <router-link class="icon iconfont icon-fanhui2" to='/' tag='span'></router-link>
            <span class="title">歌单广场</span>
        </div>
            <TopMenu :list='menuList'></TopMenu>
        </div> 
        <div class="item">
         <router-view ></router-view>
        </div>
    </div>
</template>
<script>
import TopMenu from "../components/TopMenu";
export default {
  name: "SongList",
  data() {
    return {
      menuList: [
        { name: "推荐", href: "/songlist/" },
        {
          name: "华语 ",
          href: "/songlist/chinese",
        },
        {
          name: "古风 ",
          href: "/songlist/ancientry",
        },
       {
          name: "欧美  ",
          href: "/songlist/occident",
        },
        {
          name: "流行 ",
          href: "/songlist/prevalent",
        },
        {
          name: "轻音乐 ",
          href: "/songlist/etc",
        },
        {
          name: "摇滚 ",
          href: "/songlist/rock",
        },
      ]
    };
  },
  components: {
    TopMenu
  }
};
</script>

<style lang="less" scoped>
.song-list {
  .menu{
      position: fixed;
      top:0;
      width: 100%;
      max-width: 750px;
      z-index:99;
      background: linear-gradient(to bottom, #bab9b5 0%, #ffffff 100%);
    .top {
    font-size: 0.433333rem;
    font-weight: bold;
    color: #000;
    padding: 0.416667rem;
    .icon {
      font-size: 0.466667rem;
      margin-right: 0.166667rem;
    }
  }
  }
  .item {
    margin-top:2.6rem;
  }
}
</style>
