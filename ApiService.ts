import { App } from "vue";
import axios, { AxiosResponse } from "axios";
import VueAxios from "vue-axios";
import JwtService from "./JwtService";
import UserService from "./UserService";
// import { addDebugDate } from "../../core/services/CustomFunctions";
import Swal from "sweetalert2";
import i18n from "../plugins/i18n";

const addDebugDate = (name = "", data: unknown): boolean => {
  const debugMode = import.meta.env.VITE_APP_DEBUG_MODE;
  if (debugMode == "1") {
    console.log(name, data);
  }
  return true;
};

/**
 * @description service to call HTTP request via Axios
 */
class ApiService {
  /**
   * @description property to share vue instance
   */
  public static vueInstance: App;

  /**
   * @description initialize vue axios
   */
  public static init(app: App<Element>) {
    ApiService.vueInstance = app;
    ApiService.vueInstance.use(VueAxios, axios);
    ApiService.vueInstance.axios.defaults.baseURL =
      import.meta.env.VITE_APP_API_URL;
  }

  /**
   * @description set the default HTTP request headers
   */
  public static setHeader(token = "" as string): void {
    ApiService.vueInstance.axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${token !== "" ? token : JwtService.getToken()}`;
    ApiService.vueInstance.axios.defaults.headers.common["Accept"] =
      "application/json";
  }

  /**
   * @description logoutMessages when respons code 401
   */
  public static logOutMessage(
    status: number | string,
    title?: string,
    icon: "error" | "info" | "success" = "error",
    text?: string
  ): void {
    if (status == 401) {
      const credentials = {
        name: import.meta.env.VITE_APP_API_LOGIN || "",
        password: import.meta.env.VITE_APP_API_PASSWORD || "",
      };

      UserService.login(credentials).then(() => {
        window.location.reload();
      });
      return;
    } else {
      const { t } = i18n.global;
      Swal.fire({
        title: title || t("errTextAlert"),
        text: text || t("errTitleAlertWrong"),
        icon: icon,
        toast: true,
        timer: 7000,
        timerProgressBar: true,
        position: "top-end",
        buttonsStyling: false,
        customClass: {
          confirmButton: "invisible_button",
        },
      });
    }
  }

  /**
   * @description send the GET HTTP request
   * @param resource: string
   * @param slug: string
   * @returns Promise<AxiosResponse>
   */
  public static get(
    resource: string,
    data?: object | string
  ): Promise<AxiosResponse> {
    return new Promise((resolve, reject) => {
      ApiService.vueInstance.axios
        .get(`${resource}`, { params: data })
        .then((data) => {
          addDebugDate(`responseGetSUCCESS - ${resource}`, data);
          return resolve(data);
        })
        .catch(({ response }) => {
          addDebugDate(`responseGetFAIL - ${resource}`, response);
          ApiService.logOutMessage(response.status, "error");
          return reject(response);
        });
    });
  }

  /**
   * @description set the POST HTTP request
   * @param resource: string
   * @param params: object
   * @returns Promise<AxiosResponse>
   */
  public static post(
    resource: string,
    params: object | string
  ): Promise<AxiosResponse> {
    return new Promise((resolve, reject) => {
      ApiService.vueInstance.axios
        .post(`${resource}`, params)
        .then((data) => {
          addDebugDate(`responsePostSUCCESS - ${resource}`, data);
          return resolve(data);
        })
        .catch((response) => {
          addDebugDate(`responsePostFAIL - ${resource}`, response);
          ApiService.logOutMessage(response.status);
          return reject(response);
        });
    });
  }

  /**
   * @description send the UPDATE HTTP request
   * @param resource: string
   * @param slug: string
   * @param params: object
   * @returns Promise<AxiosResponse>
   */
  public static update(
    resource: string,
    slug: string,
    params: object
  ): Promise<AxiosResponse> {
    return new Promise((resolve, reject) => {
      ApiService.vueInstance.axios
        .put(`${resource}/${slug}`, params)
        .then((data) => {
          addDebugDate(`responseUpdateSUCCESS - ${resource}`, data);
          return resolve(data);
        })
        .catch(({ response }) => {
          addDebugDate(`responseUpdateFAIL - ${resource}`, response);
          ApiService.logOutMessage(response.status);
          return reject(response);
        });
    });
  }

  /**
   * @description Send the PUT HTTP request
   * @param resource: string
   * @param params: object
   * @returns Promise<AxiosResponse>
   */
  public static put(resource: string, params: object): Promise<AxiosResponse> {
    return new Promise((resolve, reject) => {
      ApiService.vueInstance.axios
        .put(`${resource}`, params)
        .then((data) => {
          addDebugDate(`responsePutSUCCESS - ${resource}`, data);
          return resolve(data);
        })
        .catch(({ response }) => {
          addDebugDate(`responsePutFAIL - ${resource}`, response);
          ApiService.logOutMessage(response.status);
          return reject(response);
        });
    });
  }

  /**
   * @description Send the DELETE HTTP request
   * @param resource: string
   * @returns Promise<AxiosResponse>
   */
  public static delete(resource: string): Promise<AxiosResponse> {
    return new Promise((resolve, reject) => {
      ApiService.vueInstance.axios
        .delete(resource)
        .then((data) => {
          addDebugDate(`responseDeleteSUCCESS - ${resource}`, data);
          return resolve(data);
        })
        .catch(({ response }) => {
          addDebugDate(`responseDeleteFAIL - ${resource}`, response);
          ApiService.logOutMessage(response.status);
          return reject(response);
        });
    });
  }
}

export default ApiService;
