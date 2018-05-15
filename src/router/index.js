import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import toplist from '@/components/toplist'
import ranklist from '@/components/ranklist'
import playing from '@/components/playing'
import singerlist from '@/components/singer'
import special from '@/components/special'
import recommend from '@/components/recommend'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/toplist',
      name: 'toplist',
      component: toplist
    },
    {
      path: '/ranklist:id',
      name: 'ranklist',
      component: ranklist
    },
    {
      path: '/playing',
      name: 'playing',
      component: playing
    },
    {
      path: '/singerlist',
      name: 'singerlist',
      component: singerlist
    },
    {
      path: '/special:userId',
      name: 'special',
      component: special
    },
    {
      path: '/recommend:id',
      name: 'recommend',
      component: recommend
    },
  ]
})
