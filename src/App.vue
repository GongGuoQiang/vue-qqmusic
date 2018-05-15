<template>
  <div id="app">
    <router-view/>
    <playBottom></playBottom>
    <transition name="list-view">
      <component :is="showlist && 'listView'"></component>
    </transition>
  </div>
</template>

<script>
import playBottom from './components/play-bottom'
import List from './components/list'
import store from './store';
import { mapState } from 'vuex';
export default {
  name: 'App',
  data(){
      return {
            prevRoutes: []
      }
  },
  computed: {
      ...mapState('transition', ['transitionName']),
      ...mapState('list', {showlist: 'show'})
  },
  methods: {
      // Clear Transition Effects After Each Switch
      clearTransition() {
          store.commit('transition/setTransition', '');
      },
      _openlist(el, done) {
          let lisview = el.children[0];
          lisview.classList.add('active');
      }
  },
  watch:{
      $route(to, from) {
          if (!(to.meta.noPageAnimation || from.meta.noPageAnimation)) {
              if (to.name === this.prevRoutes[this.prevRoutes.length-1]) {
                  store.commit('transition/setTransition', 'turn-off');
                  this.prevRoutes.pop();
              }else {
                  if (from.name != null) {
                      store.commit('transition/setTransition', 'turn-on');
                      this.prevRoutes.push(from.name);
                  }
              }
          }
      }
  },
  components:{
      playBottom,
      listView(resolve) {
          require(['@/components/list.vue'], resolve);
      }
  }
}
</script>

<style>

</style>
