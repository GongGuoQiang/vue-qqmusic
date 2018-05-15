<template>
	<div class="mint-header" :class="{'is-fixed' : fixed }">
          <div class="mint-header-button is-left">
              <slot name="left"></slot>
          </div>
          <transition name="fade">
              <h1 class="mint-header-title" v-show="show">
                  <p ref="title">{{ title }}</p>
              </h1>
          </transition>
          <div class="mint-header-button is-right">
              <slot name="right"></slot>
          </div>
	</div>
</template>

<script>
	export default {
		data() {
			return {

			};
		},
        props:{
            fixed: Boolean,
            title: String,
            showTitle:Boolean
        },
		methods: {

		},
		components: {

		},
        computed:{
            show() {
                return this.showTitle;
            },
        },
        watch: {

        }
	}
</script>

<style lang="scss">
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
