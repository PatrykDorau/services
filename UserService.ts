import ApiService from "./ApiService";
import JwtService from "./JwtService";
import { pageInfoStore } from "../stores/Global";

type FormData = {
  name: string;
  password: string;
};

type User = {
  userId: number;
  isActive: boolean;
  isAdmin: boolean;
  lang: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  phone: string;
  posCode: string;
  posName?: {
    whsCode: string;
    whsName: string;
  };
};

class UserService {
  public static user = {} as User;
  public static isAuth = !!JwtService.getToken();

  public static getUser = (): User => {
    return JSON.parse(localStorage.getItem("UserData") || "[]");
  };

  public static isAdmin = this.getUser().isAdmin;

  public static getAuth = (): boolean => {
    return this.isAuth;
  };

  public static setAuth = (data: { token: string; user: User }): void => {
    this.isAuth = true;
    this.user = data.user;
    JwtService.saveToken(data.token);
  };

  public static purgeAuth = (): void => {
    this.isAuth = false;
    this.user = {} as User;
    JwtService.destroyToken();
  };

  public static verifyAuth = (): boolean => {
    const token = JwtService.getToken();

    if (!token) {
      this.purgeAuth();
      return false;
    }

    const tokenData = JwtService.parseTokenData(token);

    if (!tokenData) {
      this.purgeAuth();
      return false;
    }

    const currentTime = Math.floor(Date.now() / 1000);

    if (tokenData.exp <= currentTime) {
      this.purgeAuth();
      return false;
    }

    ApiService.setHeader(token);
    return true;
  };

  public static setUser = (token: string) => {
    const tokenParsed = JwtService.parseTokenData(token);
    ApiService.setHeader(token);
    return ApiService.get(`User/${tokenParsed?.user_id}`)
      .then(({ data }) => {
        if (data.success == true) {
          const user = data.data[0];
          if (user.enabled == false) {
            return false;
          }
          const store = pageInfoStore();
          store.initializeUser(user);
          store.storeDataInitialized = true;
          this.setAuth({ token, user });

          return true;
        }
      })
      .catch((response) => {
        const error = {
          authUser: "Failed login",
        };
        if (response.data.success == false) {
          error.authUser = response.data.errorMessage;
        }
        return null;
      });
  };

  public static login = (credentials: FormData) => {
    return ApiService.post("Auth", credentials)
      .then(({ data }) => {
        if (data?.success == true) {
          const token = data.data[0].token;
          return this.setUser(token);
        }
      })
      .catch((response) => {
        const error = {
          authUser: "Failed login",
        };
        if (response.data.success == false) {
          error.authUser = response.data.errorMessage;
        }
        return null;
      });
  };
}

export default UserService;
