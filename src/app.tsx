import React, { useLayoutEffect, useState } from "react";
import {
  BasicLayoutProps,
  Settings as LayoutSettings,
} from "@ant-design/pro-layout";
import { notification } from "antd";
import { history, RequestConfig } from "umi";
import RightContent from "@/components/RightContent";
import Footer from "@/components/Footer";
import { ResponseError } from "umi-request";
import { queryCurrent } from "./services/user";
import defaultSettings from "../config/defaultSettings";
import pageRoutes from "../config/pageRoutes";
import { WalletOutlined } from "@ant-design/icons";
import JWT from "jsonwebtoken";
import { outLogin } from "./services/login";
import { getPageQuery } from "./utils/utils";
import { stringify } from "qs";

export async function getInitialState(): Promise<{
  currentUser?: API.CurrentUser;
  settings?: LayoutSettings;
}> {
  if (history.location.pathname !== "/user/login") {
    try {
      const currentUser = await queryCurrent();
      return {
        currentUser,
        settings: defaultSettings,
      };
    } catch (error) {
      // if (history.location.pathname == "/user/smsLogin") {
      //   history.push("/user/smsLogin");
      // } else if (history.location.pathname == "/user/mailLogin") {
      //   history.push("/user/mailLogin");
      // } else {
      history.push("/user/login");
      // }
    }
  }
  return {
    settings: defaultSettings,
  };
}

export const layout = ({
  initialState,
}: {
  initialState: {
    settings?: LayoutSettings;
    currentUser?: API.CurrentUser;
  };
}): BasicLayoutProps => {
  const permsJWT = localStorage.getItem("perms");
  let perms: any;
  if (!!permsJWT) {
    const data = JWT.decode(permsJWT);
    perms = data;
  }

  const filterRoute: any = ({ hideInMenu, routes }: any) => {
    if (!!routes) {
      let cond = false;
      routes.forEach((sub) => {
        let _perm = filterRoute(sub);
        if (!!_perm) {
          cond = true;
        }
      });

      if (!cond) {
        return false;
      }
    }

    if (hideInMenu === undefined) return true;

    if (typeof hideInMenu === "boolean") return !hideInMenu;

    if (perms) {
      return perms[hideInMenu];
    }

    return true;
  };
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    footerRender: () => <Footer />,
    onPageChange: () => {
      if (hasExpired()) {
        loginOut();
      }
      if (
        hasExpired() ||
        (!initialState?.currentUser?.id &&
          history.location.pathname !== "/user/login" &&
          history.location.pathname !== "/user/smsLogin" &&
          history.location.pathname !== "/user/mailLogin")
      ) {
        switch (history.location.pathname) {
          case "/user/smsLogin":
            history.push("/user/smsLogin");
            break;
          case "/user/mailLogin":
            history.push("/user/mailLogin");
            break;
          default:
            history.push("/user/login");
            break;
        }
      }
    },
    menuHeaderRender: undefined,
    menuDataRender: () =>
      !!perms
        ? [
            ...pageRoutes.filter(filterRoute).map((route) => ({
              path: route.path,
              name: route.name,
              icon: <WalletOutlined />,
              children: route.routes
                ? route.routes.filter(filterRoute).map((sub) => {
                    console.log(
                      sub.name,
                      sub.hideInMenu,
                      perms[sub.hideInMenu]
                    );
                    return {
                      path: sub.path,
                      name: sub.name,
                    };
                  })
                : undefined,
            })),
          ]
        : [],
    ...initialState?.settings,
  };
};

const codeMessage = {
  200: "The server successfully returned the requested data",
  201: "New or modified data successfully",
  202: "A request has entered the background queue (asynchronous task).",
  204: "Data deleted successfully",
  400: "There was an error in the request sent, and the server did not create or modify data.",
  401: "The user does not have permission (the token, username, password is wrong).",
  403: "The user is authorized, but access is forbidden.",
  404: "The request sent was for a record that did not exist, and the server did not operate.",
  405: "The request method is not allowed.",
  406: "The requested format is not available",
  410: "The requested resource is permanently deleted and will no longer be available.",
  422: "When creating an object, a validation error occurred.",
  500: "An error occurred in the server, please check the server.",
  502: "Gateway error.",
  503: "The service is unavailable, and the server is temporarily overloaded or maintained.",
  504: "The gateway timed out.",
};
const errorHandler = (error: ResponseError) => {
  const { response, data } = error;
  console.log("res statıus", response.status);
  console.log("data", data);

  if (hasExpired() || response.status === 401) {
    notification.error({
      description: "Oturumunuzun Süresi Doldu!",
      message: "Oturumunuzun Süresi Doldu, Lütfen Tekrar Giriş Yapınız!",
    });
    loginOut();
    return;
  } else if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    console.log(errorText);
    console.log(data);

    notification.error({
      message: `Info`,
      description: data
        ? data?.message
          ? data?.message
          : data.Message
          ? data.Message
          : "Something went wrong!"
        : "Something went wrong!",
    });
  }
  if (!response) {
    notification.error({
      description: "Bağlantı Hatası!",
      message: "Lütfen internet bağlantınızı kontrol ediniz!",
    });
  }
  throw error;
};
export const request: RequestConfig = {
  errorHandler,
};
const loginOut = async () => {
  await outLogin();
  const { redirect } = getPageQuery();
  // Note: There may be security issues, please note
  if (window.location.pathname !== "/user/login" && !redirect) {
    history.replace({
      pathname: "/user/login",
      search: stringify({
        redirect: window.location.href,
      }),
    });
  }
  window.location.reload();
};
const hasExpired = (): boolean => {
  var token = localStorage.getItem("token");
  var decodeToken = JWT.decode(token!!);
  var exp = decodeToken?.exp;
  if (Date.now() >= exp * 1000) {
    localStorage.removeItem("perms");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    return true;
  }
  return false;
};
