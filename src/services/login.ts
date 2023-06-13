import { BASE_URL } from "@/utils/http";
import { request } from "umi";

export interface LoginParamsType {
  email: string;
  password: string;
}

export async function accountLogin(params: LoginParamsType) {
  const result = request<API.LoginStateType | API.TwoFactorLogin>(
    BASE_URL + "/Auth/login",
    {
      method: "POST",
      data: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return result;
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

export async function outLogin() {
  return request("/api/login/outLogin");
}
