<template>
    <div class="page playing-container">
        <transition :css="false"  @enter="_bounceDown" appear>
            <mt-header fixed class="music-header-3 playing-header" :title="songMsg.data.songname">
                <span slot="left" @click="$router.go(-1)">
  			  	<img src="../assets/arrow-down.png" width="26">
  			  </span>
              <mt-button icon="more" slot="right"></mt-button>
            </mt-header>
        </transition>
        <div class="content-wrapper">
            <div class="slide-container">
                <mt-swipe :auto="0" @change="handleChange" :show-indicators="indicator">
                  <mt-swipe-item>
                      <div class="title-wrap">
                          <p>
                              <img src="../assets/horizontal.png" width="18">
                              <router-link tag="span"
                                           style="vertical-align: middle"
                                           :to="{name: 'singer', params: {id:songMsg.data.singer[0].mid}}">
                                  &nbsp;{{ songMsg.data.singer[0].name }}&nbsp;
                              </router-link>
                              <img src="../assets/horizontal.png" width="18">
                          </p>
                          <img :src="ablumImgUrl"
                               class="ablum"
                               :class="{'spin': playingState != 'pause'}">
                          <p class="lyric">{{ currentLyric }}</p>
                      </div>
                  </mt-swipe-item>
                  <mt-swipe-item>
                      <div class="lyrics-wrapper"
                           ref="lyricsWrapper"
                           @touchstart="scrollAbled = false"
                           @touchend="scrollAbled = true">
                          <div class="lyrics">
                              <p v-for="(item, key) in lyricsArr"
                                 v-if="item"
                                 :class="key == lyricIndex && 'gradient'"
                                 :style="key == lyricIndex && lyricObj">{{ item }}</p>
                          </div>
                      </div>
                  </mt-swipe-item>
                </mt-swipe>
            </div>
        </div>
        <transition :css="false" @enter="_bounceUp" appear>
            <div class="play-wrapper">
                <div class="timer">
                    <span>{{playingCurrent}}</span>
                    <div class="progress" ref="progress">
                        <div class="progress-bar" style="{width: playingPrgress*100 + '%'}"></div>
                        <span class="progress-ball" style="{left:playingPrgress*100 + '%'}"></span>
                    </div>
                    <span>{{ playTiming	}}</span>
                </div>
                <div class="play-control">
                    <img :src="require(`../assets/${playOrder}.png`)" @click="switchPlayOrder" class="order-icon">
                    <img @click="playSong('prev')" src="../assets/back.png" class="back-icon">
                    <img @click="pause(playingState == 'pause' ? '' : 'pause')"
                         :src="require(`@/assets/${this.songState.playingState == 'pause' ? 'play-2':'pause-2'}.png`)"
                         class="play-icon">
                    <img @click="playSong('next')" src="../assets/prev.png" class="back-icon">
                    <img src="../assets/list.png" class="list-icon" @click="toggleShow">
                </div>
            </div>
        </transition>
        <div class="bgimg-blur" :style="{backgroundImage: `url(${ablumImgUrl})`}"></div>
        <div class="overlay"></div>
	</div>
</template>

<script>
	import { mapState, mapMutations, mapActions } from 'vuex';
	import Velocity from 'velocity-animate';
	const NameSpace = 'playing';

	export default {
		name: 'playing',
		data() {
			return {
                indicator:true,
                lyrics: {
                    linearGradient: 0
                },
                touch: {
                    startProgress: 0,
                    width: 0,
                    x: 0
                },
                lastTouch: {
                    x: 0
                }
			};
		},
		computed: {
            ...mapState(NameSpace, ['songMsg','songState']),
            playingState() {
                return this.songState.current;
            },
            playingCurrent() {
                return this.songState.current;
            },
            playingPrgress() {
                return this.songsTATE.playingProgress;
            },
            playTiming() {
                return this.songState.timing;
            },
            playOrder() {
                return this.songState.playingOrder;
            },
            currentLyric() {
                return this.songState.currentLyricArr[this.songState.currentLyricIndex];
            },
            ablumImgUrl() {
                let albummid = this.songMsg.data.albummid;
                if (albummid) {
                    return this.songMsg.songblum_prfix + albummid + '.jpg?max_age=2592000';
                }else {
                    return 'https://y.gtimg.cn/mediastyle/mobile/app/share/img/music_logo.png?max_age=2592000&v=30cd379f7b9491439f2e8dcd6e1508b6';
                }
            },
            lyricIndex() {
                return this.songState.currentLyricIndex;
            },
            lyricDuration() {
                return this.songState.currentLyricDuration;
            },
            lyricsArr() {
                return this.songState.currentLyricArr;
            },
            lyricObj() {
                let linearGradient = this.lyrics.linearGradient;
                return {
                    'background-image': `-webkit-linear-gradient(left,rgb(49, 194, 124) ${linearGradient}%, ${linearGradient}%)`
                };
            }
		},
		methods: {
            ...mapMutations(NameSpace, ['pause', 'switchPlayOrder', 'pruneCurrentTime']),
            ...mapMutations('list', ['toggleShow',  'modifyClass']),
            ...mapActions(NameSpace, ['playSong', 'pruneProgress']),
            handleChange(index) {
                if (index==1) {
                    this.indicator=false;
                }else {
                    this.indicator=true;
                }
            },
            _bounceDown(el) {
                Velocity(el, {translateY: -800}, {duration: 0});
                Velocity(el, {translateY: [5, [0.215, 0.610, 0.355, 1.000]]}, {duration: 400});
                Velocity(el, {translateY: [0, [0.215, 0.610, 0.355, 1.000]]}, {duration: 100}).then(() => {el.removeAttribute('style')});
            },
            _bounceUp(el) {
                Velocity(el, {translateY: 800}, {duration: 0});
                Velocity(el, {translateY: [-20, [0.215, 0.610, 0.355, 1.000]]}, {duration: 400});
                Velocity(el, {translateY: [0, [0.215, 0.610, 0.355, 1.000]]}, {duration: 100});
            },
		},
		components: {

		}
	};
</script>

<style lang="scss">
.bgimg-blur{
    z-index: 0;
    transform: scale(1.15);
    background-size: cover;
    background-position: bottom center;
    position: fixed;
    left: 0;
    top: 0px;
    height: 100%;
    width: 100%;
}
.playing-container{
    z-index: 10000;
}
.overlay {
    z-index: 1;
    height: 100%;
    width: 100%;
    position: fixed;
    background-color: rgba(0, 0, 0, 0.6);
}
.content-wrapper{
    display: flex;
    flex-flow: wrap;
    position: relative;
    position: fixed;
    top: 40px;
    bottom: 140px;
    left: 0px;
    right: 0px;
    overflow: hidden;
    z-index: 9;
}
.mint-swipe-item{
    height: 300px;

}
.music-cell-type6.active .name-wrap span {
    color: #31c27c !important;
}
.mint-swipe-indicator{
    opacity: 1;
}
.mint-swipe-indicator{
    background: #888;
}
.title-wrap{
    color: #fff;
    text-align: center;
    font-size: 14px;
    p{
        height: 40px;
        line-height: 40px;
    }
    .ablum{
        display: block;
        max-width: 100%;
        height: auto;
        display: block;
        margin-left: auto;
        margin-right: auto;
        width: 88%;
        border-radius: 50%;
        border: 8px solid rgba(0, 0, 0, 0.3);
        margin-top: 10px;
    }
}
.lyrics{
    text-align: center;
    color: #fff;
    font-size: 16px;
    p{
        line-height: 40px;
    }
}
.lyrics-wrapper{
    height: 100%;
    overflow: auto;
}
.slide-container{width: 100%;}
.playing-container .bgimg-blur, .playing-container .overlay{
        filter: blur(15px);
}
.playing-container .play-wrapper{
    position: fixed;
    left: 0px;
    bottom: 0px;
    z-index: 99;
    width: 100%;
    height: 140px;
}
.play-control{
    margin-top: 10px;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.play-control img{
    width: 2rem;
}
.timer{
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-top: 30px;
    padding: 0 20px;
    span{
        color: #fff;
        font-size: 14px;
    }
}
.timer .progress {
    position: relative;
    -ms-flex: 1;
    flex: 1;
    margin: 0 5px;
    background-image: linear-gradient(to bottom, #DCDCDC 0, #DCDCDC 100%);
    background-repeat: repeat-x;
}
.timer .progress-bar {
    width: 0;
    height: 100%;
    height: 2px;
    color: #ffffff;
    text-align: center;
    background-color: #31c27c;
    box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.15);
}
.timer .progress-ball {
    position: absolute;
    left: 0;
    top: 0;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    transform: translateY(-50%);
    background-color: #31c27c;
}
.slide-fade-enter-active {
  transition: all 2s ease;
}
.slide-fade-leave-active {
  transition: all 2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateY(140px);
  opacity: 0;
}

</style>
