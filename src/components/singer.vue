<template>
    <div class="page">
        <mt-header fixed title="歌手" class="music-header">
           <router-link to="/" slot="left">
             <mt-button icon="back"></mt-button>
           </router-link>
           <mt-button icon="more" slot="right"></mt-button>
          </mt-header>
          <div class="page-content">
                歌手api获取不成功
          </div>
	</div>
</template>

<script>
// const letter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q',
//  'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
// const loop = function() {
//     let arr = [];
//
//     letter.forEach(item => arr.push({
//         name: item,
//         index: item,
//         singerlist: []
//     }));
//     return arr;
// };
// const singerlistArr = [
//     {
//         name: '热门',
//         index: 'all',
//         singerlist: []
//     },
//     ...loop()
// ];
// 	export default {
// 		name: 'singer',
// 		data() {
// 			return {
//                 singerlistAll: {}
// 			};
// 		},
// 		computed: {
//
// 		},
// 		methods: {
//
// 		},
// 		components: {
//
// 		},
//         mounted() {
//             let i = 0,
// 				self = this,
// 				len = singerlistArr.length;
//                 let singerlistAll = singerlistArr;
//                 singerlistArr.forEach((item, index) => {
//             this.$http.get('/api/v8/fcg-bin/v8.fcg',{
//                 params: {
//                     key: `all_all_${item.index}`
//                 }
//             })
//               .then(function (response) {
//                 singerlistAll[index].singerlist = response.data.list || {};
//                 if (index >= singerlistArr.length -1) {
//                     setTimeout(() => {
//                         this.singerlistAll = singerlistAll;
//                         console.log(this.singerlistAll)
//                     }, 500);
//                 }
//               })
//               .catch(function (response) {
//                 console.log(response);
//               });
//           })
//         }
// 	};
</script>

<style lang="scss">

</style>
