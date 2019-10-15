import axios from 'axios'
import jsonp from 'axios-jsonp'
import qs from 'qs'
import store from '../store/index'
//qs 是一个增加了一些安全性的查询字符串解析和序列化字符串的库


axios.defaults.withCredentials = true; //设置跨域请求带上cookie
axios.defaults.timeout = 5000; //响应时间
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'; //配置post请求头
axios.defaults.baseURL = 'http://xxx.xxx.xxx.xxx:8080'; //配置接口地址,baseURL将被添加到url前面，除非url是绝对的。

var instance = axios.create({
  timeout: 1000,
  withCredentials: false
})
//在node中，有全局变量process表示的是当前的node进程。process.env包含着关于系统环境的信息。
//但是process.env中并不存在NODE_ENV这个东西。NODE_ENV是用户一个自定义的变量，在webpack中它的用途是判断生产环境或开发环境的依据的。
if (process.env.NODE_ENV === 'development') {
  instance.defaults.baseURL = 'http://xxx.xxx.xxx.xxx:8080';
} else if (process.env.NODE_ENV === 'production') {
  instance.defaults.baseURL = 'http://xxx.xxx.xxx.xxx:8080';
}


//POST传参序列化(添加请求拦截器)
instance.interceptors.request.use((config) => {
  //在发送请求之前做某件事
  if (config.method === 'post') {
    config.data = qs.stringify(config.data);
  }
  config.params['sessionId'] = localStorage.getItem('sid');; //有时需要配置一些默认参数
  //localStorage.setItem('sid',res.data.obj.sessionId)通过某接口（一般是login）获取sessionId，通过
  //通过缓存获取缓存sessionId并将sessionId进行赋值
  return config;
}, (error) => {
  console.log('错误的传参')
  return Promise.reject(error);
});

//返回状态判断(添加响应拦截器)
instance.interceptors.response.use((res) => {
  //对响应数据做些事
  if (!res.data.success) {
    return Promise.resolve(res);
  }
  return res;
}, (error) => {
  console.log('网络异常')
  return Promise.reject(error);
});

export default instance
