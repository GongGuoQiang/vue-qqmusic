<template>
	<transition name="router">
	<div class="page">
        <headerVue fixed class="music-header-2"
        :title="topinfo.ListName + data.day_of_year + `天`"
        :showTitle="showTitle">
            <fallback slot="left"></fallback>
            <span slot="right" style="font-size: 30px;font-weight: bold;display: inline-block;margin-top: -10px;">...</span>
        </headerVue>
        <div class="page-content" style="overflow:hidden">
            <div class="music-cover-wrap">
                <div class="music-cover"
                ref="musicCover" :style="{backgroundImage:`url(${topinfo.pic_album})`}"></div>
                <div class="title-wrap">
                    <p class="main-title" v-if="topinfo.ListName">{{topinfo.ListName}}{{data.day_of_year + `天`}}</p>
                    <p class="minor-title" style="font-size:14px;margin-top:8px">{{data.update_time}}更新</p>
                </div>
                <div class="cover-overlay"></div>
            </div>
            <div class="song-cotainer" v-if="songlist.length" ref="scrollTarget">
                <mt-navbar v-model="selected">
                  <mt-tab-item id="1">单曲</mt-tab-item>
                  <mt-tab-item id="2">详情</mt-tab-item>
                </mt-navbar>
                <!-- tab-container -->
                <mt-tab-container v-model="selected"  v-swipeup="vuetouch" v-swipedown="vueup" ref="scrollTouch">
                  <mt-tab-container-item id="1">
                    <ul>
                        <li>
                            <div class="music-cell-type4">
                                <a @click="randomPlayAll">
                                <img src="../assets/play.png" alt="" class="icon ">随机播放全部
								</a>
                            </div>
                        </li>
                        <li v-for="(song,index) in songlist" :key="index"
                             @click="playMusic(songlist, index ,song.data.songmid)">
                            <div class="music-cell-type3">
                                <div class="suffix">
                                    <p style="font-size:16px;text-align:center" :style="index<3 && {color : '#FF4500'}">{{index+1}}</p>
                                    <p>
                                        <span class="icon" :style="{backgroundImage:`url('/static/value-up.png')`}"></span>
										{{(song.in_count*100).toFixed(0)}}%
                                    </p>
                                </div>
								<div class="song">
									<p style="font-size:16px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{song.data.songname}}</p>
									<p style="font-size:10px;color:#999;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{song.data.singer[0].name}} · {{ song.data.albumname }}</p>
								</div>
								<span class="details">...</span>
                            </div>
                        </li>
                    </ul>
                  </mt-tab-container-item>
                  <mt-tab-container-item id="2">
                    <p v-html="topinfo.info"
					style="color: rgba(0, 0, 0, .5);
					padding: 0 15px;
					font-size: 14px;
					line-height: 22px;
					margin-top: 20px;"></p>
                  </mt-tab-container-item>
                </mt-tab-container>
            </div>
			<div class="ranklist-loading" v-else>
				<div class="loading">
					<mt-spinner type="fading-circle"></mt-spinner>
					<p>正在载入...</p>
				</div>
			</div>
        </div>
	</div>
	   </transition>
</template>

<script>
    import { lyricsAnalysis, getDayOfYear } from '../util/index.js';
	import  '../util/touch.js';
	import fallback from './fallback'
    import { mapMutations, mapActions } from 'vuex';
    import headerVue from './head';
	// import Transform from 'css3transform';
	// import Transform from '../../transform.js';
	// import AlloyTouch from 'alloytouch';
	const NameSpace = 'playing';
	export default {
		name: 'ranklist',
		data() {
			return {
                title:'',
				showTitle:false,
                songlist:'',
                topinfo:'',
                data:'',
                selected:'1',
				eleH:0,
				disableScroll :false
			};
		},
        mounted() {
            this.$http.get('/api/v8/fcg-bin/fcg_v8_toplist_cp.fcg',{
                params: {
	        		topid: this.$route.params.id
	        	}
            })
              .then(function (response) {
                  setTimeout(()=>{
                      this.songlist=response.data.songlist;
                      this.topinfo=response.data.topinfo;
                      this.data=response.data;
                      console.log(this.songlist)
					  console.log(this.topinfo)
                      console.log(this.data)

                  },400)
              })
              .catch(function (response) {
                console.log(response);
              });
        },
		methods: {
            randomPlayAll:function(){
                this.stackSonglist(this.songlist);
				this.switchPlayOrder('random');
				this.playSong('next');
            },
			...mapMutations(NameSpace,['switchPlayOrder','stackSonglist']),
			...mapActions(NameSpace, ['playSong']),
            playMusic:function(songlist, index, songid){
				this.stackSonglist(songlist);
				this.switchPlayOrder("random");
				this.playSong('next');
				console.log(songid)
            },
			vuetouch:function(s,e){
				let scrollTarget = this.$refs.scrollTarget;
					scrollTarget.style.top="40px";
					this.showTitle=true;
            },
			vueup:function(s,e){
                this.eleH=document.getElementsByClassName('mint-tab-container')[0].scrollTop;
				let scrollTarget = this.$refs.scrollTarget;
				if (this.eleH == 0) {
					scrollTarget.style.top="46%";
					this.showTitle=false;
				} else {
					scrollTarget.style.top="40px";
					this.showTitle=true;
				}
			},
		},
		components: {
            headerVue,fallback
		},
		watch:{

		}

	}
</script>

<style lang="scss" >
  .mint-header.is-fixed{
      position: fixed;
      top: 0;
      left: 0;
      z-index: 3;
      right: 0;
  }
  .mint-header-button{
	  flex:0;
  }
  .mint-tab-container{
	  overflow: auto;
	  background: #fff;
	  position: absolute;
	  left: 0px;
	  width: 100%;
	  height: 100%;
	  padding-bottom: 60px;
  }
  .song-cotainer, .ranklist-loading {
    position: absolute;
    left: 0;
    right: 0;
    top: 46%;
    overflow: hidden;
	height: 100%;
	transition: all 0.3s;
	background: #fff;
}
  .music-cover-wrap{
      position: relative;
      z-index: 0;
      margin-top: -40px;
      .music-cover{
          width: 100%;
          background-size: cover;
          transition: blur .3s ease;
           background-repeat: no-repeat;
           &:after{
               display: block;
               content: '';
               padding-top: 90%;
           }
      }
      .title-wrap{
          position: absolute;
          left: 0px;
          bottom:25%;
          color: #fff;
          font-size: 18px;
          z-index: 3;
          width: 100%;
          text-align: center;
      }
      .cover-overlay{
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          right: 0;
          background: rgba(0,0,0,0.7)
      }
  }
   .music-cell-type4 {
	  height: 60px;
	  display: flex;
	  color: #4a4a4a;
	  font-size: 16px;
	  padding: 0 10px;
	  align-items: center;
	  justify-content: space-between;
	  .icon {
		  width: 24px;
		  margin-right: 10px;
	  }
  }
  .music-cell-type3{
	  height: 60px;
	  display: flex;
	  color: #4a4a4a;
	  font-size: 16px;
	  padding: 0 10px;
	  align-items: center;
	  justify-content: space-between;
	  line-height: 24px;
  }
  .mint-navbar .mint-tab-item.is-selected {
      border-bottom: 3px solid #31c27c;
      color: #31c27c;
      margin-bottom: 3px;
  }
  .music-cell-type3{
	  .song{
		  flex: 1;
		  margin-left: 10px;
		  overflow: hidden;
	  }
	  .details{
		    display: inline-block;
			margin-right: 15px;
			margin-left: 10px;
			font-size: 18px;
			font-weight: bold;
	  }
	  .suffix{
		  font-size: 12px;
		  color: #999;
		  .icon{
			  display: inline-block;
			 width: 8px;
			 height: 8px;
			 background-size: cover;
			 background-repeat: no-repeat;
		  }
	  }

  }
  .router-enter-active, .router-leave-active {
      transition: transform .5s ease;
  }
  .router-enter, .router-leave-to {
      transform: translateX(100%);
  }
  .loading{
	  margin-top:20px;
	  text-align: center;
	  font-size: 14px;
	  display: flex;
	  justify-content: center;
	  align-items: center;
	  color: #888;
  }
</style>
