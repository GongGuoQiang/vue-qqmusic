<template>
	<div class="fallback">
      <i class="mintui mintui-back arrow" @click="bind()"></i>
	</div>
</template>

<script>
    import { mapMutations } from 'vuex';
	export default {
		data() {
			return {

			};
		},
        mounted() {

        },
		methods: {
            bind(){
				this.$router.go(-1);
			}
		},


	}
</script>

<style lang="scss" >

</style>
