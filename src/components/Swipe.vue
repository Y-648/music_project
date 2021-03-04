// 轮播图组件
import { clear } from '../../../../html5/05-HTML5\u753B\u5E03-\u4EE3\u7801/4-\u4EE3\u7801/incubator-echarts/src/component/dataZoom/history';
<template>
    <div class="swipe">
        <ul class="box" :style="{transform:`translateX(-${offsteLeft})`,'transition': isAnimate?'all .5s linear':''}" @transitionend='end'>
           <!-- 复制最后一张图片 -->
            <router-link tag="li" to="/" v-if='list'>
                <div class="img-box">
                    <img :src="lastImg.pic">
                    <span :style="{backgroundColor:lastImg.titleColor}" v-if='lastImg.showAdTag'>{{lastImg.typeTitle}}</span>
                </div>
            </router-link>
          <router-link tag="li" to="/" v-for='l in list' :key='l.bannerId'>
                <div class="img-box">
                    <img :src="l.pic">
                    <span :style="{backgroundColor:l.titleColor}" v-if='l.showAdTag'>{{l.typeTitle}}</span>
                </div>
            </router-link>
              <!-- 复制第一张图片 -->
          <router-link tag="li" to="/" v-if='list'>
                <div class="img-box">
                    <img :src="fristImg.pic">
                    <span :style="{backgroundColor:fristImg.titleColor}" v-if='fristImg.showAdTag'>{{fristImg.typeTitle}}</span>
                </div>
            </router-link>
        </ul>
        <div class="dot">
            <ul>
                <li v-for='(l,k) in list' :key='k' :class="{active:currentIndex==k+1 || (currentIndex==0 && k==list.length-1)}">1</li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
  //轮播数组
  props: {
    list: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      currentIndex: 1,
      elWidth: 0,
      timer: null, //定时器
      lastImg: [],
      isAnimate: true, //是否有动画
      fristImg: [],
      stratX: 0 //按下时的初始位置
    };
  },
  methods: {
    nextImg() {
      //下一张
      this.currentIndex++;
      this.isAnimate = true;
    },
    prveImg() {
      //上一张
      this.currentIndex--;
      this.isAnimate = true;
    },
    end() {
      if (this.currentIndex == this.list.length) {
        this.isAnimate = false;
        this.currentIndex = 0;
      } else if (this.currentIndex < 1) {
        this.currentIndex = this.list.length;
        this.isAnimate = false;
      }
    }
  },
  computed: {
    offsteLeft() {
      return this.currentIndex * this.elWidth + "px";
    }
  },
  watch: {
    list(newValue) {
      this.lastImg = newValue[newValue.length - 1];
      this.fristImg = newValue[0];
    }
  },
  mounted() {
    this.elWidth = document.querySelector(".swipe").clientWidth;
    window.onresize = () => {
      this.elWidth = document.querySelector(".swipe").clientWidth;
    };
    this.timer = setInterval(this.nextImg, 3000);
    // 当浏览器切换页面或该页面最小化时关闭定时器
    document.addEventListener("visibilitychange", ()=>{
      if (document.hidden === true) {
         clearInterval(this.timer);
      } else {
        this.timer = setInterval(this.nextImg, 3000);
      }
    });
  },
  beforeRouteLeave() {
    clearInterval(this.timer);
  }
};
</script>
<style lang="less" scoped>
.swipe {
  position: relative;
  .box {
    display: flex;
    li {
      height: 3.333333rem;
      flex: 100%;
      flex-shrink: 0;
      .img-box {
        position: relative;
        width: 93%;
        margin: 0 auto;
        height: 100%;
        border-radius: 0.116667rem;
        img {
          width: 100%;
          height: 100%;
        }
        span {
          position: absolute;
          bottom: -0.016667rem;
          right: -0.016667rem;
          padding: 0.066667rem 0.166667rem;
          border-radius: 0.083333rem;
          color: #fff;
          font-size: 0.166667rem;
        }
      }
    }
  }
  .dot {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 0.25rem;
    ul {
      display: flex;
      li {
        height: 0.166667rem;
        width: 0.166667rem;
        border-radius: 50%;
        background-color: rgb(147, 158, 158);
        margin-right: 0.1rem;
        text-indent: -9999px;
        &.active {
          background-color: #d43c33;
        }
      }
    }
  }
}
</style>
