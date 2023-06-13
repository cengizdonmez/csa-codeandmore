import React, { useEffect, useState } from "react";
import { LogoutOutlined } from "@ant-design/icons";
import { DownOutlined } from '@ant-design/icons';
import { Avatar, Spin, Dropdown } from "antd";
import type { MenuProps } from 'antd';

import { history, useModel } from "umi";
import { getPageQuery } from "@/utils/utils";
import { outLogin } from "@/services/login";
import { stringify } from "querystring";
import styles from "./index.less";
import { useCreate } from "@/pages/CategoryPages/services";

export interface GlobalHeaderRightProps {
  menu?: boolean;
}

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
  const [initialState, setInitialState] = useState(null);
  const defaultAvatar = require("../../../public/icons/avatardefault.png");
  const [logOut, logOutResp, logOutStatus] = useCreate("/Auth/logout");

  const loginOut = async () => {
    // await outLogin();
    await logOut({});
    localStorage.removeItem("perms");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    setInitialState({ ...initialState, currentUser: undefined });
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
  };

  useEffect(() => {
    setInitialState(JSON.parse(localStorage.getItem("user") as string));
  }, []);

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }
  const currentUser = initialState;
  //
  // if (!currentUser) {
  //   return loading;
  // }

  const items: MenuProps['items'] = [
    {
      label: 'Profil Düzenle',
      key: 'profile',
      onClick: () => {
        history.push("/profile");
      }
    },
    {
      label: 'Şifre Değiştir',
      key: 'password',
      onClick: () => {
        history.push("/password-change");
      }
    },
    {
      icon: <LogoutOutlined />,
      label: 'Çıkış Yap',
      key: 'logout',
      onClick: () => {
        loginOut();
      }
    },
  ];

  return (
    <div>
      <Dropdown  menu={{ items }} placement="bottomRight"
      overlayStyle={{ minWidth: 160}}
      >
        <div className={`${styles.action} ${styles.account}`}>
          <Avatar
            size="small"
            className={styles.avatar}
            src={currentUser.filePath || defaultAvatar}
            alt="avatar"
          />
          <span className={`${styles.name} anticon`}>
            {currentUser.firstName}
          </span>
        </div>
      </Dropdown>
    </div>
  );
};

export default AvatarDropdown;
