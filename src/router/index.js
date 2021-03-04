import Vue from 'vue'
import VueRouter from 'vue-router'
import Discover from '../views/Discover.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Discover',
    component: Discover
  },
  {
    path: '/songlist',
    name: 'SongList',
    component: ()=>import('../views/SongList.vue'),
    children:[
      {
        path: '/songlist/',
        name: 'SongListInfo',
        component: ()=>import('../views/SongListInfo.vue'),
        meta:{
          index:0,
          name:'songlist'
        }
      },
      {
        path: '/songlist/chinese',
        props:{cat:'华语'},
        name: 'Chinese',
        component: ()=>import('../views/SongListInfo.vue'),
        meta:{
          index:1,
          name:'songlist'
        }
      },
      {
        path: '/songlist/ancientry',
        props:{cat:'古风'},
        name: 'Ancientry',
        component: ()=>import('../views/SongListInfo.vue'),
        meta:{
          index:2,
          name:'songlist'
        }
      },
      {
        path: '/songlist/occident',
        props:{cat:'欧美'},
        name: 'Occident',
        component: ()=>import('../views/SongListInfo.vue'),
        meta:{
          index:3,
          name:'songlist'
        }
      },
      {
        path: '/songlist/prevalent',
        props:{cat:'流行'},
        name: 'Prevalent',
        component: ()=>import('../views/SongListInfo.vue'),
        meta:{
          index:4,
          name:'songlist'
        }
      },
      {
        path: '/songlist/etc',
        props:{cat:'轻音乐'},
        name: 'Etc',
        component: ()=>import('../views/SongListInfo.vue'),
        meta:{
          index:5,
          name:'songlist'
        }
      },
      {
        path: '/songlist/rock',
        props:{cat:'摇滚'},
        name: 'Rock',
        component: ()=>import('../views/SongListInfo.vue'),
        meta:{
          index:6,
          name:'songlist'
        }
      },
      {
        path: '/songlist/:numlist',
        component: ()=>import('../views/SongListInfo.vue'),
        meta:{
          index:0,
          name:'songlist'
        }
      },
    ]
  },
  {
    path: '/search',
    component: ()=>import('../views/Search.vue'),
    name:'Search',
    meta:{
      name:'search'
    },
    children:[
      {
        path: '/search/',
        props:true,
        component: ()=>import('../views/SearchResult.vue'),
        meta:{
          index:0,
          name:'search',
          type:'searchall',
        }
      },
      {
        path: '/search/songs',
        props:{data:'1'},
        component: ()=>import('../views/SearchResult.vue'),
        name:'Songs',
        meta:{
          index:1,
          name:'search',
          type:'searchsong'
        }
      },
      {
        path: '/search/songlist',
        props:{data:'1000'},
        component: ()=>import('../views/SearchResult.vue'),
        name:'SongLists',
        meta:{
          index:2,
          name:'search',
          type:'searchsonglist'
        }
      },
      {
        path: '/search/artist',
        props:{data:'100'},
        component: ()=>import('../views/SearchResult.vue'),
        name:'Artist',
        meta:{
          index:4,
          name:'search',
          type:'searchartist'
        }
      },
      {
        path: '/search/album',
        props:{data:'10'},
        component: ()=>import('../views/SearchResult.vue'),
        name:'Album',
        meta:{
          index:3,
          name:'search',
          type:'searchalbum'
        }
      },
    ]
  },
  {
    path:'/playlist',
    name:'PlayList',
    props:true,
    component:()=> import('../views/PlayList.vue'),
    meta:{
      name:'playlist'
    }
  }
  
]

const router = new VueRouter({
  mode: 'hash',
  linkExactActiveClass:'active',
  linkActiveClass:'link',
  base: process.env.BASE_URL,
  routes
})

export default router
