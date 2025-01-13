/* eslint-disable */
// @ts-ignore
import VueJwtDecode from "vue-jwt-decode";
/* eslint-enable */

const ID_TOKEN_KEY = "id_token" as string;

type dataJWT = {
  aud: string;
  user_id: number;
  exp: number;
  unique_name: string;
};

/**
 * @description get token form localStorage
 */
export const getToken = (): string | null => {
  return window.localStorage.getItem(ID_TOKEN_KEY);
};

/**
 * @description save token into localStorage
 * @param token: string
 */
export const saveToken = (token: string): void => {
  window.localStorage.setItem(ID_TOKEN_KEY, token);
};

/**
 * @description remove token form localStorage
 */
export const destroyToken = (): void => {
  window.localStorage.removeItem(ID_TOKEN_KEY);
};

export const parseTokenData = (token: string | null): dataJWT | null => {
  if (!token || typeof token !== "string") {
    console.error("Invalid token format:", token);
    return null;
  }

  try {
    return VueJwtDecode.decode(token); // Try decoding the token
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null; // Return null when decoding fails
  }
};

// export const parseTokenData = (token: string): dataJWT => {
//   try {
//     const data = VueJwtDecode.decode(token);
//     return data;
//   } catch (error) {
//     return VueJwtDecode.decode(error);
//   }
// };

export default { getToken, saveToken, destroyToken, parseTokenData };
