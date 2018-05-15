<template>
	<div class="list-view" :class="listclass">
		<div class="header">
			<div>
				<img class="order-icon"
					 @click="switchPlayOrder"
					 :src="require(`../assets/${playingOrder}-2.png`)">
				<span class="font" v-if="playingOrder == 'cycle'">顺序播放{{ songlist.length }}首</span>
				<span class="font" v-if="playingOrder == 'singleCycle'">单曲循环</span>
				<span class="font" v-if="playingOrder == 'random'">随机播放{{ songlist.length }}首</span>
			</div>
			<img class="rubbish" src="../assets/rubbish.png" @click="clearSongStack">
		</div>
        <ul>
            <li v-for="(item, key) in songlist" @click="playSong(key)">
                <mt-cell class="music-cell-type6" :class="{active: key == songState.currentIndex}" :key="key">
                    <div class="name-wrap">
                        <span>{{ item.data.songname }}</span>
                        <span>{{ item.data.singer[0].name }}</span>
                    </div>
                    <i class="icon-delete"
                       @click="clearSong(key)"
                       style="background-image: url('/static/delete.png')"></i>
                </mt-cell>
            </li>
        </ul>
		<div class="close" @click="toggleShow">关闭</div>
		<!-- <div class="overlay" @click="toggleShow"></div> -->
	</div>
</template>

<script>
	import { mapState, mapMutations, mapActions } from 'vuex';
	const NameSpace = "playing";

	export default {
		name: 'list',
        mounted(){
           console.log(this.songlist)
        },
		computed: {
			...mapState(NameSpace, ['songlist', 'songState']),
			...mapState('list', {showlist: 'show', listclass: 'class'}),
			playingOrder() {
				return this.songState.playingOrder;
			}
		},
		methods: {
			...mapMutations(NameSpace, ['playSong', 'switchPlayOrder', 'stackSonglist']),
			...mapMutations('list', ['toggleShow']),
			...mapActions(NameSpace, ['playSong', 'clearSongStack', 'clearSong'])
		}
	};
</script>

<style lang="scss">
.list-view {
    z-index: 20000;
    position: absolute;
    overflow: hidden;
    top: 30%;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ffffff;
    .header{
        display: flex;
        height: 50px;
        padding: 0 20px;
        align-items: center;
        justify-content: space-between;
        font-size: 16px;
        .order-icon{
            width: 30px;
        }
        .rubbish{
            width: 30px;
        }
    }
    ul{
        position: absolute;
        top: 50px;
        left: 0px;
        bottom: 50px;
        width: 100%;
        overflow: auto;
        .mint-cell {
            background-color: #fff;
            box-sizing: border-box;
            color: inherit;
            min-height: 48px;
            display: block;
            overflow: hidden;
            position: relative;
            text-decoration: none;
        }
    }
    .close{
        position: absolute;
        bottom: 0px;
        line-height: 60px;
        left: 0px;
        width: 100%;
        text-align: center;
        font-size: 16px;
        z-index: 999
    }
}
.music-cell-type6 .mint-cell-wrapper {
    background-image: none;
    padding: 0 20px;
}
.music-cell-type6 .mint-cell-value {
    -ms-flex: 1;
    flex: 1;
    overflow: hidden;
}
.music-cell-type6 .mint-cell-value .name-wrap {
    -ms-flex: 1;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.music-cell-type6 .mint-cell-value .icon-delete {
    width: 30px;
    height: 30px;
    background-size: cover;
}
</style>
