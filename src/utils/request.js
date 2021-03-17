import axios from 'axios'
import {Toast} from 'vant'
import {getStore,removeStore} from "./utils";
import store from '../store/store'

const baseURL = process.env.VUE_APP_API || 'https://api.weifengqi18.com';
const service = axios.create({
  baseURL: baseURL,
  timeout: 3000, // 请求超时时间
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

service.interceptors.response.use(
  response => {
    if (response.data.code === 200) {
      return response
    }else {
      Toast(response.data.message)
    }
  },error => {
   if (error.code === 'ECONNABORTED' || error.message === 'Network Error' || error.message.includes('timeout')) {
     Toast.fail('数据加载中，请检查网络是否正常...');
     // 超时处理 ，返回code: Network Error
     return {
       data: {
         code: 'Network Error'
       }
     };
   } else if (error.response.status === 403) {
      removeStore('login-secret-key')
      removeStore('ticketid')
      removeStore('userInfo')
      store.state.isLogin = false;
      store.userInfo = {};
    }
    return error.response
  }
);
service.interceptors.request.use(
  config => {
    const secretKey = getStore('login-secret-key')
    const ticketid = getStore('ticketid')
    if(![null, '', undefined].includes(secretKey)) {
      config.headers['login-secret-key'] = getStore('login-secret-key')
    }
    if(![null, '', undefined].includes(ticketid)) {
      config.headers['ticketid'] = getStore('ticketid')
    }
    return config
  },error => {
    console.log(error)
    Promise.reject(error)
  }
)

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
  return new Promise((resolve, reject) => {
    service.get(url, {
      params: params
    }).then(res => resolve(res.data))
      .catch(err => reject(err.data))
  })
}
/**
 * post方法，对应put请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function put(url, params) {
  return new Promise((resolve, reject) => {
    return service({
      url,
      method: 'put',
      data: params,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => resolve(res.data))
      .catch(err => reject(err.data))
  })
}

/**
 * del方法，对应put请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function del(url, params) {
  return new Promise((resolve, reject) => {
    return service({
      url,
      method: 'delete',
      data: params,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => resolve(res.data))
      .catch(err => reject(err.data))
  })
}

/**
 * post方法，对应post请求 body传参
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params) {
  return new Promise((resolve, reject) => {
    return service({
      url,
      method: 'post',
      data: params,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => resolve(res.data))
      .catch(err => reject(err.data))
  })
}
/**
 * post方法，对应post请求 query传参
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function postQ(url, params) {
  return new Promise((resolve, reject) => {
    return service({
      url,
      method: 'post',
      params,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => resolve(res.data))
      .catch(err => reject(err.data))
  })
}

