<template>
	<div class="page">
        <mt-header fixed title="音乐馆" class="music-header scroll-header" :style="searchVisible && {top: '-40px'}"></mt-header>
		<form @submit="searching">
			<search-vue v-model="searchValue"
			            :visible.sync="searchVisible"
						:style="searchVisible && {top:'-40px',height:'100%',height:'100vh'}">
				<div class="hotkey-wrapper" v-if="searchState == 0">
                    <p style="color:#666;font-size:14px;margin-bottom:10px;">热门搜索</p>
					<ul class="hotkey-list">
						<template v-for="(item,index) in hotmusic">
							<template v-if="index == 0">
                                <li class="speical" @click="goSpecial(item.url)">
									{{item.k}}
								</li>
							</template>
							<template v-else>
								<li @click="hoykeySearch(item.k)">
									{{item.k}}
								</li>
							</template>
						</template>
					</ul>
				</div>
				<div class="result-list" v-if="searchState == 2">
					<mt-cell class="music-cell-type5"
					v-for="(item, index) in searchResult"
					:key="index"
					@click.native='playSingleMusic(item)'>
					  <i class="music-icon"></i>
					  <div class="song-wrapper">
						<p>{{item.name}}</p>
					  	<p>{{item.singer}}</p>
					  </div>
					</mt-cell>
				</div>

			</search-vue>
		</form>
		<div class="page-content" style="margin-top:84px;padding-top:0;">
				<mt-swipe :auto="4000">
				  <mt-swipe-item v-for="(item,index) in swiperimg.slider" :key="index" >
					  <img class="img" :src="item.picUrl" @click="goSpecial(item.linkUrl)">
				  </mt-swipe-item>
				</mt-swipe>
            <ul class="radio-list">
            	<li v-for="item in musiclist" @click="golist(item.route)">
                    <img class="icon" :src="require(`../assets/${item.icon}`)" alt="">
					<span class="name">{{item.name}}</span>
				</li>
            </ul>
			<div class="recommend-wrapper">
				<p class="title">热门推荐</p>
				<ul class="recommend-list">
					<router-link v-for="(item,index) in swiperimg.songList" tag='li' :key="index"
					:to="{name:'recommend',params:{id:item.id}}">
                        <div class="cover-wrapper">
                        	<img :src="item.picUrl" alt="">
							<span class="listen-count">
								<i class="listen-icon"></i>
								{{item.accessnum/10000 || listenFormat/10000}}万
							</span>
							<i class="listen-play"></i>
                        </div>
						<span class="song-desc">{{item.songListDesc}}</span>
					</router-link>
				</ul>
			</div>
		</div>
    </div>
</template>
<script>
import { dealHotkey } from '../util';
import searchVue from './search'
import store from '../store';
	const NameSpace = 'playing';
	export default {
		data() {
			return {
                searchVisible: false,
				swiperimg:{},
				hotmusic:{},
				searchValue:'',
				searchState:0,
				searchResult:{},
				musiclist: [
					{
						icon: 'people.png',
						name: '歌手',
						route: 'singerlist'
					},
					{
						icon: 'rank.png',
						name: '排行',
						route: 'toplist'
					},
					{
						icon: 'radio.png',
						name: '电台',
						route: 'radio'
					}
				],
			}
		},
		components:{
		 searchVue
		},
		mounted() {
			this.$http.get('/api/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg')
			  .then(function (response) {
			   this.swiperimg=response.data.data;
			   console.log("54",this.swiperimg)
			  })
			  .catch(function (response) {
			    console.log(response);
			  });
			this.$http.get('/api/splcloud/fcgi-bin/gethotkey.fcg')
				.then(function (response) {
				 this.hotmusic=dealHotkey(response.data.data);
				 console.log(this.hotmusic)
				})
				.catch(function (response) {
				  console.log(response);
				});
		},
		computed: {

		},
		methods: {
            searching(e) {
                e && e.preventDefault();
				let searchValue = this.searchValue;
				this.searchState = 1;

				this.$http.get('/api/splcloud/fcgi-bin/smartbox_new.fcg',{
					params: {
		        		key: searchValue
		        	}
				})
					.then(function (response) {
					 this.searchState = 2;
					 this.searchResult = response.data.data.song.itemlist || [];;
					 console.log(this.searchResult)
					})
					.catch(function (response) {
					  console.log(response);
					});
			},
			hoykeySearch(hotkey) {
				this.searchValue=hotkey;
				this.searching();
			},
			goSpecial(id){
                this.$router.push({
					 name: 'special',
					 params: { userId: id }
				 })
			},
			golist(url){
				this.$router.push({
					name:url
				})
			},
			playSingleMusic(song = {}) {
				let songObj = {
					data: {
						songid: song.id,
						songname: song.name,
						singer: [{
							name: song.singer
						}]
					}
				};
				store.commit(NameSpace + '/stackSonglist', songObj);
				store.dispatch(NameSpace + '/playSong', 0);
			}
		},
		watch: {
			searchVisible(visible){
				if (!visible) {
					this.searchState = 0;
					this.searchResult = [];
				}
			}
		}
	}
</script>
<style lang="scss" scoped>
.scroll-header {
	transition: top .5s ease;
}
.img{
	max-width: 100%;
	display: block;
	height: auto;
}
.radio-list{
	display: flex;
	justify-content: space-between;
	padding: 20px;
}
.mint-swipe-items-wrap > div{
	height: auto;
}
.mint-swipe-items-wrap{
	height: auto!important;
}
.icon{
	width: 30px;
	height: 30px;
	margin-right: 10px;
	display: inline-block;
}
.radio-list > li{
	display: flex;
	display: -ms-flexbox;
	-ms-flex:1;
	flex:1;
	justify-content: center;
	align-items: center;
}
.name{font-size: 14px;}
.mint-swipe{
	height: 156px;
}
.recommend-wrapper{
	.title{
		text-align: center;
		font-size: 20px;
		line-height: 48px;
	}
	.recommend-list{
		display: flex;
		display: -ms-flexbox;
		flex-wrap: wrap;
		justify-content: space-between;
		font-size: 12px;
		li{
			flex-basis: 33%;
			.cover-wrapper{
				position: relative;
				img{
					max-width: 100%;
					height: auto;
					display: block;
				}
				.listen-count{
					position: absolute;
					left: 0;
					bottom:10px;
					color: #fff;
					.listen-icon{
						display: inline-block;
						background-position: 0 -50px;
						background-image: url(https://y.gtimg.cn/mediastyle/mobile/yqq_v5/img/list_sprite.png?max_age=19830212&d=20151105145423);
						background-repeat: no-repeat;
						background-size: 24px 60px;
						width: 10px;
						height: 10px;
						margin: 0 3px;
					}
				}
				.listen-play{
					position: absolute;
					top: 100%;
					right: 5px;
					width: 24px;
					height: 24px;
					margin-top: -28px;
					background: url(https://y.gtimg.cn/mediastyle/mobile/yqq_v5/img/list_sprite.png?max_age=19830212&d=20151105145423);
					background-repeat: no-repeat;
					background-size: 24px 60px;
				}
			}
			.song-desc{
				padding: 5px;
				display: block;
				line-height: 1.2
			}
		}

	}
}
.hotkey-wrapper>p{
	font-size: 14px;
	color: #888;
	margin-bottom: 10px;
}
.hotkey-wrapper{
    padding: 15px;
	.hotkey-list{
		display: flex;
		display: -ms-flexbox;
		flex-wrap: wrap;
		li{
			font-size: 14px;
			margin: 0 5px 10px 0;
			padding: 0 10px;
			line-height: 30px;
			border-radius: 16px;
			border: 1px solid #d7d7d7;
			height: 30px;
			text-align: center;
		}
		.speical{
			border-color: #31c27c;
			color: #31c27c;
		}
	}

}
.result-list{
	.mint-cell-value{
		flex: 1;
		.music-icon{
			width: 22px;
			height: 20px;
			margin-right: 20px;
			background-image: url(https://y.gtimg.cn/mediastyle/mobile/yqq_v5/img/search_sprite.png?max_age=19830212&d=20151105145423);
			background-repeat: no-repeat;
			background-size: 22px 30px;
		}
		.song-wrapper{
			line-height: 18px;
			margin: 10px 0 2px;
			flex: 1;
			p:first-child{
				color: #333;
				font-size: 16px;
			}
			p:last-child{
				color: #888;
				font-size: 14px;
				margin-bottom: 10px;
			}
		}
	}
	.mint-cell-title{
		position: absolute;
	}


}
</style>
