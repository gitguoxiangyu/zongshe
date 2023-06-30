import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { message } from "antd";
interface IRequestOptions {
  url: string;
  method: AxiosRequestConfig["method"];
  data?: AxiosRequestConfig["data"];
  params?: AxiosRequestConfig["params"];
  headers?: AxiosRequestConfig["headers"];
}
interface IResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

class HttpClient {
  private readonly instance: AxiosInstance;
  constructor(baseURL?: string) {
    this.instance = axios.create({ baseURL });
    this.instance.interceptors.response.use(
      this.handleSuccessResponse,
      this.handleErrorResponse
    );
    this.instance.interceptors.request.use(
      (config) => {
        // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
        // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
        const token: string | null = window.localStorage["token"];
        token && (config.headers.Authorization = token);
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }
  private handleSuccessResponse(response: AxiosResponse): AxiosResponse {
    return response;
  }
  private handleErrorResponse(error: any): Promise<never> {
    message.error(error.message || "请求失败");
    return Promise.reject(error);
  }
  public async request<T = any>({
    url,
    method,
    data,
    params,
    headers,
  }: IRequestOptions): Promise<IResponse<T>> {
    const response = await this.instance.request<T>({
      url,
      method,
      data,
      params,
      headers,
    });
    return {
      code: response.status,
      message: response.statusText,
      data: response.data,
    };
  }
}

// const http = new HttpClient('/api');
const http = new HttpClient("http://116.63.167.175:8001");

export default http;
