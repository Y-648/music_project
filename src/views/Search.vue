<template>
    <div class="search" @click="hideSuggestList">
        <!-- 搜索框 -->
        <div class="search-box">
            <span class="icon iconfont icon-fanhui" @click="back"></span>
            <div class="input-box">
                <input type="text" placeholder="音乐,视频,歌词,电台" ref='input' v-model='keyWord' @input="getResult"  @click.stop="showSuggestList" @keyup.enter="enter">
            </div>
        </div>
        <!-- 搜索结果 -->
        <div class="result-box" v-show='showResult'>
          <TopMenu :list='menuList'></TopMenu>
          <div class="content">
             <router-view :keyWord='resultWord'></router-view>
          </div>
        </div>
        <!-- 历史记录 -->
        <div class="history-box" v-show='historyList.length'>
            <h3>历史</h3>
            <div class="item">
                <ul>
                    <li  v-for="(h,k) in historyList" :key='k'>{{h}}</li>
                </ul>
            </div>
            <span class="iconfont icon-shanchu" @click='clear'></span>
        </div>
        <!-- 搜索建议 -->
        <div class="suggest-box" v-show='keyWord && isShowSu'>
            <div class="keyword">搜索"<span>{{keyWord}}</span>"</div>
            <div class="item-box" v-for='(v,k,i) in suggestList' :key='i'>
                <div class="title">
                    <span class="iconfont" :class="k=='songs'?'icon-gequ':k=='albums'?'icon-zhuanji':k=='artists'?'icon-ttpodicon':'icon-gedan'"></span>
                    <span>{{k|filtType}}</span>
                </div>
            <ul>
                <li v-for='(vl,key) in v' :key='key' @click="getSuggestResult(k,vl.name)">
                <div>
                <span class="iconfont icon-sousuo"></span>
                <span>{{vl.name}}</span>
                </div>
                <div v-if="k=='songs'"><span>{{vl.artists[0].name}}</span></div>
                </li>
            </ul>
            </div>
        </div>
    </div>
</template>
<script>
import TopMenu from "../components/TopMenu";
export default {
  data() {
    return {
      keyWord: "",
      historyList: [], //历史记录数组
      suggestList: {}, //查询建议对象
      showResult: false, //显示查询结果
      resultWord: "", //确定查询的字段
      isShowSu: true, //是否显示搜索建议
      menuList: [
        { name: "综合", href: "/search/" },
        { name: "单曲", href: "/search/songs" },
        {
          name: "歌单",
          href: "/search/songlist"
        },
        { name: "专辑", href: "/search/album" },
        { name: "歌手", href: "/search/artist" }
      ]
    };
  },
  components: {
    TopMenu
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    // 获取搜索建议
    getResult() {
      this.suggestList = {};
      if (this.keyWord) {
        this.$http("/search/suggest?keywords=" + this.keyWord)
          .then(data => {
            for (let v of data.data.result.order) {
              this.$set(this.suggestList, v, data.data.result[v]);
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    // 获取搜索建议结果
    getSuggestResult(type, name) {
      this.resultWord = this.keyWord = name;
      this.showResult = true;
      if (type == "songs" && this.$route.name !='Songs') {
        this.$router.replace("/search/songs");
      } else if (type == "playlists" && this.$route.name !='SongLists') {
        this.$router.replace("/search/songlist");
      } else if (type == "albums" && this.$route.name !='Album') {
        this.$router.replace("/search/album");
      } else if (type == "artists" && this.$route.name !='Artist') {
        this.$router.replace("/search/artist");
      }
    },
    // 隐藏搜索建议
    hideSuggestList() {
      this.isShowSu = false;
    },
    // 显示搜索建议
    showSuggestList() {
      this.isShowSu = true;
    },
    enter() {
      this.isShowSu = false;
      if (this.keyWord) {
        this.$refs.input.blur();
        this.resultWord = this.keyWord;
        this.showResult = true;
      }
    },
    clear() {
      this.historyList = [];
    }
  },
  filters: {
    filtType(v) {
      if (v == "songs") {
        return "歌曲";
      } else if (v == "albums") {
        return "专辑";
      } else if (v == "artists") {
        return "歌手";
      } else if (v == "playlists") {
        return "歌单";
      }
    }
  },
  mounted() {
    //自动触焦
    this.$refs.input.focus();
  }
};
</script>
<style lang="less" scoped>
.search {
  background: #fff;
  position: relative;
  min-height: 11rem;
  .search-box {
    display: flex;
    padding: 0.25rem;
    align-items: center;
    .icon {
      font-size: 0.333333rem;
    }
    .input-box {
      margin-left: 0.25rem;
      flex: 1;
      border-bottom: 1px solid rgb(77, 74, 74);
      input {
        line-height: 0.666667rem;
        font-size: 0.333333rem;
        width: 100%;
        color: #000;
        border: none;
      }
    }
  }
  .history-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.25rem;
    font-size: 0.333333rem;
    .item {
      flex: 1;
      margin: 0 0.25rem;
      overflow-x: auto;
      ul {
        display: flex;
        justify-content: space-between;
        li {
          background: #f3f3f3;
          line-height: 0.666667rem;
          padding: 0 0.25rem;
          border-radius: 0.333333rem;
          margin-right: 0.166667rem;
          flex-shrink: 0;
        }
      }
    }
    .iconfont {
      font-size: 0.333333rem;
      color: #c5c5c5;
    }
  }
  .suggest-box {
    position: absolute;
    z-index: 10;
    background: #fff;
    width: 95%;
    max-height: 10rem;
    overflow-y: auto;
    left: 50%;
    transform: translateX(-50%);
    top: 1.166667rem;
    box-shadow: -1px -1px 8px #c5c5c5;
    line-height: 0.833333rem;
    font-size: 0.333333rem;
    .keyword {
      padding: 0 0.25rem;
      color: #017dfe;
    }
    .item-box {
      .title {
        padding: 0 0.25rem;
        .iconfont {
          margin-right: 0.166667rem;
          color: #d43c33;
          font-size: 0.333333rem;
        }
      }
      ul {
        li {
          display: flex;
          justify-content: space-between;
          padding: 0 0.25rem;
          border-top: 1px solid #c5c5c5;
          .iconfont {
            font-size: 0.333333rem;
            margin-right: 0.166667rem;
          }
        }
      }
    }
  }
}
</style>
