import Vue from 'vue';
import Vuex from 'vuex';
import footerStatus from './modules/footerStatus'
import collection from './modules/collection'
import state from './state'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'
Vue.use(Vuex);

let Store  =  new Vuex.Store({
  state: state,
  getters:getters,
  mutations: mutations,
  actions: actions,
  modules: {
    footerStatus,
    collection
  }
})

export default Store
// const state = { //要设置的全局访问的state对象
//   showFooter: true,
//   changableNum: 0
//   //要设置的初始属性值
// };


// export default new Vuex.Store({
//   modules: {
//     footerStatus,
//     collection
//   }
// });
