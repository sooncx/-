import Vue from 'vue';
import VueRouter from 'vue-router';
import userManage from '@/views/userManage/index.vue'
import deviceManage from '@/views/deviceManage/index.vue'

Vue.use(VueRouter);
function redirectUrl() {
  const USER = localStorage.getItem("USER") ? JSON.parse(localStorage.getItem("USER")) : null;
  if (!USER) return "/login";
  return "/home";
}
const routes = [
  {
    path: "/login",
    name: "login",
    component: resolve => require(['@/views/login/index.vue'], resolve)
  },
  {
    path: "/",
    name: "index",
    component: resolve => require(['@/views/index.vue'], resolve),
    redirect: redirectUrl,
    children: [
      {
        path: "/home",
        name: "home",
        component: resolve => require(['@/views/home/index.vue'], resolve)
      },
      {
        path: "/monitorCenter",
        name: "monitorCenter",
        component: resolve => require(['@/views/monitorCenter/index.vue'], resolve)
      },
      {
        path: '/deviceManage',
        name: 'deviceManage',
        component: deviceManage,
      },
      {
        path: '/userManage',
        name: 'userManage',
        component: userManage,
      }
    ],
  }
];

const router = new VueRouter({
  routes,
});

export default router;
