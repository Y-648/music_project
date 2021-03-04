<template>
<!-- 第一种 -->
    <div class="music-item">
      <div v-if="mode=='type1'" class="item-box">
        <div class="wrap">
            <img :src="imgSrc" alt="">
            <span class="tag" v-if="tag">{{tag|formatTag}}</span>
            <div class="num-box"><span class="iconfont icon-icon_play"></span><span class="num">{{num|formatNum}}</span></div>
        </div>
        <p class="name">{{name}}</p>
        </div>
        <!-- 第二种 -->
        <div v-if="mode=='type2'" class="wrap-infeed">
            <img :src="imgSrc" alt="">
            <div class="info-box">
              <div class="title">
                <span class="tl">{{name}}</span> <span class="author" v-if='author.length'>- {{author[0].name}}<span v-if="author.length>1">/{{author[1].name}}</span></span><span class="icon" v-if='sq>320000'>SQ</span>
              </div>
              <div class="info" v-if='des'>
                <span class="des">{{des}}</span>
                </div>
            </div>
            <span class="play iconfont icon-icon_play" v-if='showPlay && !hide'></span>
            <span class="music iconfont icon-gequ" v-if="hide"></span>
        </div>
        <!-- 第三种 -->
         <div v-if="mode=='type3'" class="item">
              <span :class="['num',{'red':order<=3}]" v-if="order">{{order}}</span>
              <div class="content">
                <div class="title">
               <span class="name" :style="{'color':hide?'#d43c33':'#000'}">{{name}}</span>
               <span class="author" :style="{'color':hide?'#d43c33':'#a1a1a1'}" v-if='author.length'>- {{author[0].name}}<span v-if="author.length>1">/{{author[1].name}}</span></span>
               </div>
               <div class="des-box" v-if="des && sq">
                 <span class="icon" v-if='sq>320000'>SQ</span>
                 <!-- <span class="author" v-if='author.length'>- {{author[0].name}}<span v-if="author.length>1">/{{author[1].name}}</span></span> -->
                  <span class="des">{{des}}</span>
               </div>
              </div>
               <span class="play iconfont icon-icon_play"  v-if='showPlay && !hide'></span>
               <span class="music iconfont icon-gequ" v-if="hide"></span>
         </div>
    </div>
</template>
<script>
export default {
  props: {
    imgSrc: String, //图片
    hide: Boolean, //歌曲被播放时的样式控制
    tag: String, //图片中的标记
    author: {
      type: Array,
      default: function() {
        return [];
      }
    }, //歌手
    showPlay: {
      type: Boolean,
      default: true
    }, //是否显示播放按钮
    sq: Number, //是否为无损音质
    des: String, //描述
    name: {
      type: String,
      default: ""
    }, //名字
    num: Number, //播放量
    mode: {
      type: String,
      default: "type1" //组件显示类型
    },
    order: Number //歌曲排名
  },
  methods: {},
  filters: {
    formatNum(value) {
      return (value / 1000).toFixed(1) + "万";
    },
    formatTag(value) {
      if (value.length <= 4) {
        return value;
      } else {
        return "";
      }
    }
  }
};
</script>toFixed
<style lang="less" scoped>
.music-item {
  .item-box {
    .wrap {
      position: relative;
      height: 3rem;
      width: 100%;
      border-radius: 0.133333rem;
      overflow: hidden;
      img {
        display: block;
        width: 100%;
        height: 100%;
      }
      .tag {
        position: absolute;
        left: 0.166667rem;
        bottom: 0.166667rem;
        font-size: 0.2rem;
        color: #fff;
        padding: 0 0.05rem;
        background: rgba(102, 101, 101, 0.3);
        border-radius: 0.033333rem;
      }
      .num-box {
        position: absolute;
        top: 0.166667rem;
        right: 0.166667rem;
        color: #fff;
        font-size: 0.2rem;
        text-shadow: 1px 1px 3px rgba(102, 101, 101, 0.3);
      }
    }
    .name {
      margin-top: 0.066667rem;
      width: 2.8rem;
      line-height: 0.416667rem;
      font-size: 0.233333rem;
      color: rgb(36, 35, 35);
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }

  .wrap-infeed {
    display: flex;
    justify-content: space-between;
    align-items: center;
    img {
      height: 1rem;
      width: 1rem;
      border-radius: 0.166667rem;
    }
    .info-box {
      flex: 1;
      padding: 0.25rem 0.166667rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      .title {
        color: #b6b6b6;
        font-size: 0.233333rem;
        display: flex;
        align-items: center;
        .tl {
          font-size: 0.3rem;
          color: #000;
          overflow: hidden;
          margin-right: 0.083333rem;
          max-width: 70%;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .icon {
          margin-left: 0.083333rem;
          border: 1px solid #d43c33;
          color: #d43c33;
          font-size: 0.166667rem;
        }
        .author {
          color: #a1a1a1;
          font-size: 0.233333rem;
          margin-left: 0.066667rem;
        }
      }
      .info {
        margin-top: 0.083333rem;
        .des {
          color: #d5d5d5;
          font-size: 0.25rem;
          display: inline-block;
          max-width: 70%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-left: 0.066667rem;
        }
      }
    }
    .play {
      height: 0.5rem;
      width: 0.5rem;
      flex-shrink: 0;
      border-radius: 50%;
      border: 1px solid #bbbaba;
      text-align: center;
      line-height: 0.5rem;
      color: #d43c33;
    }
    .music {
      color: #d43c33;
      font-size: 0.3rem;
    }
  }

  .item {
    display: flex;
    padding: 0.25rem;
    justify-content: space-between;
    align-items: center;
    .num {
      color: #a2a2a2;
      font-size: 0.3rem;
      margin-right: 0.25rem;
      &.red {
        color: #d43c33;
      }
    }
    .content {
      overflow: hidden;
       flex: 1;
      .title {
        overflow: hidden;
        display: flex;
        align-items: center;
        .name {
          font-size: 0.333333rem;
          max-width: 70%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .author {
           max-width: 30%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 0.233333rem;
          margin-left: 0.066667rem;
        }
      }
      .des-box {
        margin-top: -0.166667rem;
         overflow: hidden;
         max-width: 6.666667rem;
        text-overflow: ellipsis;
        white-space: nowrap;
        .icon {
          border: 1px solid #d43c33;
          color: #d43c33;
          font-size: 0.166667rem;
          margin-right: 0.066667rem;
        }
        .des {
          color: #a5a4a4;
          font-size: 0.2rem;
        }
      }
    }
    .play {
      height: 0.5rem;
      width: 0.5rem;
      flex-shrink: 0;
      border-radius: 50%;
      border: 1px solid #bbbaba;
      text-align: center;
      line-height: 0.5rem;
      color: #d43c33;
    }
    .music {
      color: #d43c33;
      font-size: 0.3rem;
    }
  }
}
</style>
