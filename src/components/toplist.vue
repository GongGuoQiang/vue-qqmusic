<template>
  <div class="page">
      <mt-header fixed title="排行" class="music-header">
         <router-link to="/" slot="left">
           <mt-button icon="back"></mt-button>
         </router-link>
         <mt-button icon="more" slot="right"></mt-button>
        </mt-header>
        <div class="page-content">
            <div class="title">
                Q Q 音 乐 巅 峰 榜
            </div>
            <ul>
                <router-link class="list" tag="li"
                 v-for="item in toplist.topList"
                :key="item.id"
                :to="{name:'ranklist',params:{id:item.id}}">
                    <div class="music-cell-type2">
                        <div class="listen-cover">
                            <img :src="item.picUrl" alt="">
                            <span class="listen-count">
                                <i class="listen-icon"></i>
                                {{item.listenCount/10000}}万
                            </span>
                            <i class="listen-play"></i>
                        </div>
                        <div class="song-list">
                            <div v-for="(song,index) in item.songList" class="song-item">
                                {{index+1}}
                                {{song.songname}}
                                <span class="song-singer">{{'-'+song.singername}}</span>
                            </div>
                        </div>
                        <span class="song-arrow"></span>
                    </div>
                </router-link>
            </ul>
        </div>
  </div>
</template>

<script>
  // import fallback from './fallback.vue';

  export default {
    name: 'toplist',
    mounted() {
        this.$http.get('/api/v8/fcg-bin/fcg_myqq_toplist.fcg')
          .then(function (response) {
           let string=response.data;
           let data=string.substring(18,string.length-1);
           this.toplist=JSON.parse(data).data;
          })
          .catch(function (response) {
            console.log(response);
          });
    },
    data() {
      return {
            toplist:'',
      };
  },
  methods: {

  },
  computed: {

  },
  };
</script>

<style lang="scss">
   .title{
       height: 45px;
       line-height: 45px;
       text-align: center;
       font-size: 16px;
   }
   .list{
       margin:0 10px 10px 10px;
       background: #fff;
       position: relative;
       .music-cell-type2{
           display: flex;
           width: 100%;
           box-sizing: border-box;
           align-items: center;
           .listen-cover{
               width: 33%;
               position: relative;
               img{
                   display: block;
                   width: 100%;
                   max-width: 100%;
               }
               .listen-count{
                   position: absolute;
                   left: 0px;
                   bottom: 4px;
                   color: #fff;
                   font-size: 12px;
                   .listen-icon{
                       display: inline-block;
                        width: 10px;
                        height: 10px;
                        margin-left: 3px;
                        margin-right: 3px;
                        background-position: 0 -50px;
                        background-image: url(https://y.gtimg.cn/mediastyle/mobile/yqq_v5/img/list_sprite.png?max_age=19830212&d=20151105145423);
                        background-repeat: no-repeat;
                        background-size: 24px 60px;
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
           .song-list{
                font-size: 14px;
                line-height: 26px;
                flex:1;
                overflow: hidden;
                margin-right: 10px;
                .song-item{
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    font-size: 14px;
                    margin-left: 10px;
                    .song-singer{
                        color: #888;
                    }
                }
           }
           .song-arrow{
               position: absolute;
               right: 10px;
               top: 50%;
               border-top: 1px solid #888;
               border-right: 1px solid #888;
               transform: rotate(45deg);
               width: 6px;
               height: 6px;
           }
       }
   }

</style>
