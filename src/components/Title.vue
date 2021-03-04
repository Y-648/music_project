<template>
 <div class="title">
    <p v-if='info'>{{info}}</p>
    <div class="box">
            <div class="name">
            <img :src="logo" v-if='logo'/>
            <span>{{title}}</span>
            </div>
        <router-link tag='div' :to='`${href}`' class="more">
        <span v-if='icon' :class="['iconfont',icon]"></span>
        <span>{{handle}}</span></router-link>
    </div>
    </div>
</template>
<script>
export default {
    // info是否有描述
    // title标题名字
    // logo 是否带有logo
    //icon操作中是否有图标
    // handle操作名字
    props:['info','title','logo','icon','handle','href'],
}
</script>

<style lang="less" scoped>
.title{
    p{
        color: rgb(168, 165, 165);
        font-size: 0.233333rem;
        padding: 0 0.25rem;
    }
.box{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding:0 0.25rem 0.15rem;
    .name{
        display: flex;
        align-items: center;
        color: #000;
        font-weight: bold;
        font-size: 0.4rem;
    }
    .more{
        padding: 0.083333rem 0.25rem;
        border-radius: 0.333333rem;
        font-size: 0.266667rem;
        border: 1px solid rgb(211, 205, 205);
    }
}
}
</style>
