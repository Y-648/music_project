<template>
    <div class="topmenu">
        <ul>
            <li v-for='(v,k) in list' :key='k'>
                 <router-link :to="{
                     path:v.href,
                     name:v.cName,
                     params:{data:v.cat}
                 }" tag='span' :class="{'active-router':$route.meta.index==k}" replace>{{v.name}}</router-link>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    props:['list'],
}
</script>
<style lang="less" scoped>
    .topmenu{
        ul{
            border-bottom: 1px solid #e4e7e6;
            display: flex;
            justify-content: space-between;
            align-items: center;
            overflow-x: auto;
            li{
                width: 20%;
                flex-shrink: 0;
                text-align: center;
                span{
                    font-size: 0.3rem;
                    padding:0.2rem 0;
                    display:inline-block;
                    &.active-router{
                        font-weight: bold;
                        color: #d43c33;
                        border-bottom: 2px solid #d43c33;
                    } 
                }
            }
        }
    }
</style>
