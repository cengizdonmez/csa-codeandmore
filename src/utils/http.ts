import { request, RequestConfig } from "umi";


//const BACKENDURL = "https://carrefourtest.azurewebsites.net";
const BACKENDURL = "https://localhost:5000";
export const BASE_URL = BACKENDURL + "/api";

export function worker(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  body: any = undefined,
  contentType:
    | "multipart/form-data"
    | "application/json;charset=UTF-8" = "application/json;charset=UTF-8"
) {
  const requestConfig: RequestConfig = {
    headers: {
      Accept: "application/json",
      "Content-Type": contentType,
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    method,
  };

  if (method !== "GET" && method !== "DELETE" && body) {
    requestConfig.data = { ...body };
  }

  const requestUrl = `${BASE_URL}${url}`;

  return request(requestUrl, requestConfig).then((res) => {
    return res;
  });
}

export type Status = "rejected" | "pending" | "fulfilled" | null;
export const imageUrl = "https://carrefourtest.azurewebsites.net";

//export const imageUrl = "http://localhost:5001";
