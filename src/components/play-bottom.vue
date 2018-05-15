<template>
	<div class="fixed-wrapper">
        <mt-cell class="music-cell-song-fied">
            <router-link tag="div" class="song-cover" :to="{name:'playing'}"
			@touchstart.native="swipeStart"
			@touchmove.native="swipeMove"
			@touchend.native="swipeEnd">
                <img  :src="ablumImgUrl"class="song-album-img" :class="{'spin-slow':playingState != 'pause'}" alt="">
                <div class="name-desc">
                    <p>{{ songMsg.data.songname }}</p>
                    <p>{{ currentLyric || (songMsg.data.singer && songMsg.data.singer[0].name) }}</p>
                </div>
            </router-link>
            <div class="play-wrapper">
                <div class="circle-wrapper yuan">
                    <img class="play-icon" @click="pause(playingState == 'pause' ? '' : 'pause')" :src="require(`../assets/${this.songState.playingState == 'pause' ? 'play-small' : 'pause'}.png`)" alt="">
                </div>
                <img src="../assets/list-green.png" alt="" class="list-icon" @click="toggleShow">
            </div>
        </mt-cell>
		<audio :src="songMsg.getMedia(songMsg.data.songid)" ref="audio" @timeupdate='_playProgress'>

		</audio>
    </div>
</template>
<script>
import store from '../store';
import { mapState, mapMutations, mapActions } from 'vuex';
import { lyricsAnalysis } from '../util';
import utf8 from 'utf8';
import base64 from 'base-64';
const NameSpace = 'playing';
	export default {
		data() {
			return {
				currentLyric: '',
				lyricsObj: {
				  timeArr: [],       // each lyric start time
				  lyricsArr: [],    // each item lyric
				  durationArr: []  // each lyric cost time,
			},
			swipeObj: {
				start: {
					x: 0
				},
				move: {
					x: 0
				}
			}
		}
		},
		components:{

		},
		mounted() {

		},
		computed: {
			...mapState(NameSpace, ['songMsg', 'songState']),
			playingState() {
				return this.songState.playingState;
			},
			playingSongid() {
				return this.songMsg.data.songid;
			},
			playingPrgress() {
				return this.songState.playingProgress;
			},
			currentTime() {
				return this.songState.current;
			},
			pruneTime() {
				return this.songState.pruneTime;
			},
			ablumImgUrl() {
				let albummid = this.songMsg.data.albummid;
				if (albummid) {
					return this.songMsg.songblum_prfix + albummid + '.jpg?max_age=2592000';
				}else {
					// default image
					return 'https://y.gtimg.cn/mediastyle/mobile/app/share/img/music_logo.png?max_age=2592000&v=30cd379f7b9491439f2e8dcd6e1508b6';
				}
			}
		},
		methods: {
			...mapMutations(NameSpace, ['pause', 'switchLyricIndex', 'switchLyricsArr', 'switchLyricDuration']),
			...mapMutations('list', ['toggleShow']),
			...mapActions(NameSpace, ['playSong']),
			_playProgress(e) {
				let audio = e.target,
					currentTime = audio.currentTime,
					duration = audio.duration;
				store.dispatch(NameSpace + '/resetProgress', {currentTime, duration});
			},
			swipeStart(e) {
				let touch = e.changedTouches[0];
				this.swipeObj.x = touch.clientX;
			},
			swipeMove(e) {
				this.swipeObj.move.x = e.changedTouches[0].clientX;
			},
			swipeEnd() {
				let touch = this.swipeObj.move,
					offsetX = touch.x > 0 ? touch.x - this.swipeObj.x : 0;

				if (Math.abs(offsetX) >= 60) {
					offsetX < 0 ? this.playSong('next') : this.playSong('prev');
				}
				// clear swipe obj
				this.swipeObj.start = this.swipeObj.move = {};
			},
			jsonp(urlObj, callback) {
				let url = urlObj.url,
					callbackName = urlObj.jsonpCallback;
				    window[callbackName] = function(data) {
					window[callbackName] = undefined;
					document.body.removeChild(script);
					callback(data);
				};

				let script = document.createElement('script');
				script.src = url;
				document.body.appendChild(script);
			}
		},
		watch:{
			playingState(state) {
				let audio = this.$refs.audio;

				if (state == 'pause') {
					audio.pause()
				}else {
					// Check if first frame has been downloaded, otherwise recursice call this function
					// 30 times if it still fail throw a error and change the play state
					let stack = 0;
					function recursivePlay() {
						// Attention the play method return a promise
						let playPromise = audio.play();
						if (playPromise) {
							playPromise.catch(e => {
								setTimeout(() => {
									++stack >= 30 ? (alert('音乐加载失败， 请重试'), store.commit(NameSpace+ '/pause', 'pause')) : recursivePlay();
								}, 500)
							});
						}
					}
					// must update the dom view first, because the audio src has not been updated now
					// the deep reason for this is because Vue watch method excute is take prioirty than
					// dom view update
					this.$nextTick(recursivePlay);
				}
			},
			// load the lyrics msg when playing song changed
			playingSongid() {
				let self = this;
				this.jsonp({
					url: `https://api.darlin.me/music/lyric/${this.playingSongid}/?callback=jsonp1`,
					jsonpCallback: 'jsonp1'
				}, reponse => {
					// decode lyrics from base64 encode and utf-8 decode
					let lyrics = utf8.decode(base64.decode(reponse.lyric));
					self.lyricsObj = lyricsAnalysis(lyrics);
					self.switchLyricsArr(self.lyricsObj.lyricsArr);
				})
			},
			// switch the current lyric as time goes by
			currentTime(time) {
				let	timeArr = this.lyricsObj.timeArr,
					lyricsArr = this.lyricsObj.lyricsArr,
					durationArr = this.lyricsObj.durationArr;

				timeArr.forEach((item, index) => {
					if (item == parseInt(time)) {
						this.currentLyric = lyricsArr[index];
						this.switchLyricIndex(index);
						this.switchLyricDuration(durationArr[index]);
					}
				});
			},
			pruneTime(time) {
				let audio = this.$refs.audio;
				audio.currentTime = time;
			},
		}
	}
</script>
<style lang="scss" scoped>
    .fixed-wrapper{
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        z-index: 999;
        .song-cover{
            display: flex;
            -ms-flex:flexbox;
            flex:1;
            height: 56px;
            align-items: center;
        }
        .play-wrapper{
            display: flex;
            align-items: center;
            .circle-wrapper{
                position: relative;
                .play-icon{
                    position: absolute;
                    left: 0;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    margin: auto;
                    width: 16px;

                }
            }
            .list-icon{
                width: 24px;
                height: 24px;
                margin-left: 16px;
            }
        }
        .mint-cell-title{
            position: absolute;
        }
    }
    .yuan{
        height: 24px;
        width: 24px;
        border-radius: 50%;
        display: inline-block;
        border: 2px solid #31c27c;
    }

</style>
<style lang="scss">
.mint-cell-title{
    flex:0;
}
.mint-cell-value{
    overflow: hidden;
    flex:1;
    justify-content: space-between;
}
.song-album-img{
	width: 45px;
	height: 45px;
	border-radius: 50%;
	display: block;
}
.name-desc{
	color: #9b9b9b;
	font-size: 14px;
	padding-left: 7px;
	p:first-child{
		font-size: 14px;
		color: #4a4a4a;
		margin-bottom: 5px;
	}
}
</style>
