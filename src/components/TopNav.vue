<template>
    <div class="top">
         <router-link  class="icon iconfont icon-icon-" to='/' tag="span"></router-link>
        <ul>
            <router-link :to='`${l.href}`' tag='li' v-for='(l,k) in list' :key='k'>{{l.name}}</router-link>
        </ul>
         <router-link  class="icon iconfont icon-sousuo" to='/search' tag="span"></router-link>
    </div>
</template>
<script>
export default {
    props:['list'],
    data() {
        return {
            
        }
    },
}
</script>
<style lang="less" scoped>
    .top{
        display: flex;
        justify-content: space-between;
        align-items: center;
        ul{
            display: flex;
            li{
                line-height:1.166667rem;
                text-align: center;
                color: rgb(168, 166, 166);
                font-size:0.266667rem;
                width:1.166667rem;
                border-radius: 50%;
                &.active{
                    font-weight: bold;
                    color: #000;
                    font-size: 0.333333rem;
                }
            }
        }
        .icon{
            font-size: 0.333333rem;
            color: #333;
        }
    }
</style>
