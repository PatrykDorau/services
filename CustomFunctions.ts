import Swal, { SweetAlertResult } from "sweetalert2";

export const addDebugDate = (name = "", data: unknown): boolean => {
  const debugMode = import.meta.env.VITE_APP_DEBUG_MODE;
  if (debugMode == "1") {
    console.log(name, data);
  }
  return true;
};

export const fireSwalMessage = (
  title: string,
  text: string,
  type: "success" | "info" | "error",
  timer: number = 10000000000
): Promise<SweetAlertResult<any>> => {
  return new Promise((resolve, reject) => {
    Swal.fire({
      title: title,
      text: text,
      icon: type,
      position: "top-end",
      toast: true,
      buttonsStyling: false,
      timer: timer,
      timerProgressBar: true,
      customClass: {
        confirmButton: "invisible__btn",
      },
    })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};


export default {
  addDebugDate,
  fireSwalMessage,
};
