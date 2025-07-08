import { App } from "vue";
import axios, { AxiosInstance, AxiosResponse } from "axios";
import VueAxios from "vue-axios";
import JwtService from "./JwtService";
import UserService from "./UserService";
import { addDebugDate } from "../../core/services/CustomFunctions";
import { AxiosRequestConfig } from "axios";
import router from "@/router/index";

/**
 * @description service to call HTTP requests via Axios using async/await
 */
class ApiService {
  // private static vueInstance: App;
  private static axiosInstance: AxiosInstance;

  /**
   * @description initialize VueAxios and set baseURL
   */
  public static init(app: App<Element>) {
    // ApiService.vueInstance = app;

    // Use global axios instance for plugin registration
    app.use(VueAxios, axios);

    // Create a custom axios instance for ApiService use
    ApiService.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_APP_API_URL,
    });

    // Optional: Global response interceptor for 401
    ApiService.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error.response?.status;
        if (status === 401) {
          UserService.purgeAuth();
          // window.location.href = `${window.location.origin}/login`;
          router.push({ name: "login" });
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * @description Set Authorization header
   */
  public static setHeader(token: string = JwtService.getToken() || ""): void {
    ApiService.axiosInstance.defaults.headers.common["Authorization"] =
      `Bearer ${token}`;
    ApiService.axiosInstance.defaults.headers.common["Accept"] =
      "application/json";
  }

  public static async get<T = any>(
    resource: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    try {
      const response = await ApiService.axiosInstance.get<T>(resource, config);
      addDebugDate(`responseGetSUCCESS - ${resource}`, response);
      return response;
    } catch (error: any) {
      addDebugDate(`responseGetFAIL - ${resource}`, error.response);

      throw error.response;
    }
  }

  public static async post<T = any>(
    resource: string,
    params: object | string
  ): Promise<AxiosResponse<T>> {
    try {
      const response = await ApiService.axiosInstance.post<T>(resource, params);
      addDebugDate(`responsePostSUCCESS - ${resource}`, response);
      return response;
    } catch (error: any) {
      addDebugDate(`responsePostFAIL - ${resource}`, error.response);

      throw error.response;
    }
  }

  public static async put<T = any>(
    resource: string,
    params: object
  ): Promise<AxiosResponse<T>> {
    try {
      const response = await ApiService.axiosInstance.put<T>(resource, params);
      addDebugDate(`responsePutSUCCESS - ${resource}`, response);
      return response;
    } catch (error: any) {
      addDebugDate(`responsePutFAIL - ${resource}`, error.response);

      throw error.response;
    }
  }

  public static async update<T = any>(
    resource: string,
    slug: string,
    params: object
  ): Promise<AxiosResponse<T>> {
    try {
      const response = await ApiService.axiosInstance.put<T>(
        `${resource}/${slug}`,
        params
      );
      addDebugDate(`responseUpdateSUCCESS - ${resource}`, response);
      return response;
    } catch (error: any) {
      addDebugDate(`responseUpdateFAIL - ${resource}`, error.response);

      throw error.response;
    }
  }

  public static async delete<T = any>(
    resource: string
  ): Promise<AxiosResponse<T>> {
    try {
      const response = await ApiService.axiosInstance.delete<T>(resource);
      addDebugDate(`responseDeleteSUCCESS - ${resource}`, response);
      return response;
    } catch (error: any) {
      addDebugDate(`responseDeleteFAIL - ${resource}`, error.response);

      throw error.response;
    }
  }
}

export default ApiService;
