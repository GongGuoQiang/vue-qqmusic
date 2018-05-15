<template>
	<div class="page">
		<mt-header fixed class="music-header" :title="title">
	      <fallback slot="left"></fallback>
	    </mt-header>
	    <div class="page-content">
            <iframe :src="url" class="special-frame" ref="frame" width="100%" height="100%"></iframe>
	    </div>
	</div>
</template>

<script>
import fallback from './fallback'
	export default {
		name: 'special',
		mounted() {
            let url = this.$route.params.userId;
            if (url) {
                this.url = decodeURIComponent(url);
            }
		},
		data() {
			return {
				title: 'QQ音乐',
				url: '',
			};
		},
        components:{
            fallback
        }
	};
</script>

<style lang="sass">

</style>
