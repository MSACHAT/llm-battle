import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import config from "@/config/config";

// 创建泛型接口，用于定义 API 响应数据结构
interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: AxiosRequestConfig;
}

// 创建 APIClient 类，封装 Axios 实例和请求方法
class APIClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 1000 * 60,
    });

    // 添加请求拦截器
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.client.interceptors.request.use(this.handleRequest, (error) =>
      Promise.reject(error),
    );
  }

  // 请求拦截器处理函数
  private handleRequest(config: AxiosRequestConfig<any>): AxiosRequestConfig {
    const token = localStorage.getItem("token");
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers["Authorization"] = `Bearer ${token}`;
      config.headers["Content-Type"] = "application/json";
    } else {
      console.log("NO TOKEN!!!");
    }
    return config;
  }

  // 响应拦截器处理函数
  private handleSuccess<T>(response: ApiResponse<T>): T {
    return response.data;
  }

  // 处理错误
  private handleError(error: any): Promise<never> {
    const errorStatus = error.response?.status;

    if (errorStatus) {
      switch (errorStatus) {
        case 400:
          console.error("请求错误");
          break;
        case 401:
          console.error("未授权");
          break;
        case 403:
          // eslint-disable-next-line no-undef
          localStorage.removeItem("token");
          console.error("禁止访问");
          break;
        case 404:
          console.error("找不到资源");
          break;
        case 405:
          console.error("方法不允许");
          break;
        case 408:
          console.error("请求超时");
          break;
        case 409:
          console.error("此用户已存在");
          break;
        case 413:
          console.error("有效负载太大");
          break;
        case 414:
          console.error("URL太长");
          break;
        case 429:
          console.error("太多请求");
          break;
        case 500:
          console.error("内部服务器错误");
          break;
        case 501:
          console.error("未实现");
          break;
        case 502:
          console.error("网关错误");
          break;
        case 503:
          console.error("服务不可用");
          break;
        case 504:
          console.error("网关超时");
          break;
        case 505:
          console.error("HTTP版本不受支持");
          break;
        default:
          console.error("其他错误状态码:", error.response.status);
          break;
      }
    } else {
      console.error("请求失败:", error.message);
    }

    return Promise.reject(error);
  }

  // GET 请求方法
  public get<T>(url: string, params?: any): Promise<T> {
    return this.client
      .get<T>(url, { params })
      .then(this.handleSuccess)
      .catch(this.handleError);
  }

  // POST 请求方法
  public post<T>(url: string, data?: any): Promise<T> {
    return this.client
      .post<T>(url, data)
      .then(this.handleSuccess)
      .catch(this.handleError);
  }

  // PUT 请求方法
  public put<T>(url: string, data?: any): Promise<T> {
    return this.client
      .put<T>(url, data)
      .then(this.handleSuccess)
      .catch(this.handleError);
  }

  // DELETE 请求方法
  public delete<T>(url: string): Promise<T> {
    return this.client
      .delete<T>(url)
      .then(this.handleSuccess)
      .catch(this.handleError);
  }

  public patch<T>(url: string, data?: any): Promise<T> {
    return this.client
      .patch<T>(url, data)
      .then(this.handleSuccess)
      .catch(this.handleError);
  }

  // 其他 HTTP 方法可以类似实现
}

// 使用方法示例
const apiClient = new APIClient(config.apiUrl);

export default apiClient;
