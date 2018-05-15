<template>
	<div class="mint-search">
        <div class="mint-searchbar">
            <div class="mint-searchbar-inner">
                <i class="mintui mintui-search"></i>
                <input
                ref='input'
                @click="visible = true"
                type="search"
                v-model="currentValue"
                :placeholder="placeholder"
                class="mint-searchbar-core">
            </div>
			<a
			class="mint-searchbar-cancel"
			@click="visible = false, currentValue = ''"
			v-show="visible"
			v-text="cancelText">
			</a>
        </div>
		<div class="mint-search-list" v-show="visible">
		  <div class="mint-search-list-warp">
			<slot>
			  <x-cell v-for="(item, index) in result" :key="index" :title="item"></x-cell>
			</slot>
		  </div>
		</div>
    </div>
</template>
<script>
	import XCell from 'mint-ui/packages/cell/index.js';
	if (process.env.NODE_ENV === 'component') {
	  require('mint-ui/packages/cell/style.css');
	}
	export default {
		data() {
			return {
                visible:false,
                currentValue: this.value,
			}
		},
		components:{
		    XCell
		},
        props: {
			value: String,
			autofocus: Boolean,
			show: Boolean,
	        placeholder: {
	            default: '搜索'
	        },
	        cancelText: {
	          default: '取消'
	        },
			result:Array
        },
		mounted() {
            this.autofocus && this.$refs.input.focus();
		},
		computed: {

		},
		methods: {

		},
		watch:{
			visible() {
				this.$emit('update:visible',this.visible);
			},
			currentValue(val){
                this.$emit('input',val)
			},
			value(val){
				this.currentValue = val;
			}
		}
	}
</script>
<style lang="scss" scoped>

</style>
