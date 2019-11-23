import QS from "qs";
import axios from "./apiConfig";
import baseURL from "./baseURL";
import store from "@/store";

const handleApiFn = data => {
  if (data.code === undefined) {
    return Promise.resolve(data);
  }

  if (data.code === 0) {
    return Promise.resolve(data);
  } else {
    return Promise.reject(data);
  }
};

const handleReject = ({ data, status } = {}) => {
  const msg = data ? data.msg : status ? status : "网络异常";
  return Promise.reject({ msg });
};

export async function GET(url, params) {
  try {
    const { data } = await axios.get(url, { params });
    return handleApiFn(data);
  } catch (err) {
    return handleReject(err);
  }
}

export async function POST(url, params) {
  try {
    const { data } = await axios.post(url, QS.stringify(params));
    return handleApiFn(data);
  } catch (err) {
    return handleReject(err);
  }
}

// 处理POSTbody序列化传参
export async function POSTBody(url, params) {
  try {
    const { data } = await axios({
      url,
      data: params,
      method: "post",
      headers: {
        "Content-Type": "application/json"
      }
    });
    return handleApiFn(data);
  } catch (err) {
    return handleReject(err);
  }
}

export async function FORM(url, params) {
  try {
    const { data } = await axios({
      url,
      data: params,
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return handleApiFn(data);
  } catch (err) {
    return handleReject(err);
  }
}

export async function JSONP(url, params) {
  try {
    const { data } = await axios({
      adapter: "jsonp",
      url: url,
      params: params,
      callbackName: "JsonCallBack",
      method: "get"
    });
    return handleApiFn(data);
  } catch (err) {
    return handleReject(err);
  }
}

/**
 * @desc   下载文件
 * @param  {String} baseUrl
 * @param  {Object} params
 */
export function exportFile(json, params) {
  //处理json
  if (json[0] === "/") {
    let jsonArr = [...json];
    jsonArr.shift();
    json = jsonArr.join("");
  }
  params.sessionId = store.state.USER.sessionId;
  //处理参数
  const arr = Object.entries(params).map(([key, val]) => `${key}=${val}`);
  const baseUrl = process.env.NODE_ENV === "development" ? baseURL : "/";
  const url = baseUrl + json + "?" + arr.join("&");
  console.log(url);

  window.open(url, "_self");
}

/**
 * @desc 将请求数组切割成50一份 分批获取地址
 * @param {Array} list
 * @return {addressList}
 */
