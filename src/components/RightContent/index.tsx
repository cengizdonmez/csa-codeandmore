import { Tag, Space, Dropdown, Spin } from "antd";
import React, { useEffect, useLayoutEffect, useState } from "react";
import type { MenuProps } from 'antd';
import { useModel } from "umi";
import Avatar from "./AvatarDropdown";
import HeaderSearch from "../HeaderSearch";
import { useGetOne, useListAll } from "../../pages/CategoryPages/services";
import useLanguage from "../../hoxmodels/language";
import usePerms from "../../hoxmodels/perms";
import usePath from "../../hoxmodels/path";
import useSystemValues from "../../hoxmodels/systemValues";
import jwt from "jsonwebtoken";
import styles from "./index.less";
import { DownOutlined } from "@ant-design/icons";
import LanguageChanger from "../LanguageChanger/LanguageChanger";

const ENVTagColor = {
  dev: "orange",
  test: "green",
  pre: "#87d068",
};

export interface LanguageListItem {
  id: number;
  flagPath: string;
  name: string;
  abbreviationName: string;
  status: boolean;
  createDate: Date;
  updateDate: null;
  createdBy: null;
  updatedBy: null;
  token: string;
}

const GlobalHeaderRight: React.FC<{}> = () => {
  const { language, onSetLanguage } = useLanguage();
  const { perms, onSetPerms } = usePerms();
  const { path, onSetPath } = usePath();
  const { onSetSystemValues } = useSystemValues();
  const [isLanguageChanging, setLanguageChange] = useState(false);

  const [getLanguages, languages, languagesStat] =
    useListAll<LanguageListItem>("/Language/getall");
  const [getSystemValue, systemValue, systemValueStatus] = useGetOne<any>(
    "/SystemValue/getbylangcode?langCode="
  );

  const items: MenuProps['items'] = languages.map((lang, index) => ({
    label: lang.name,
    key: index,
  }));

  async function onGetLanguages() {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const langs = await getLanguages();
        if (langs.length > 0) {
          const _id = localStorage.getItem("@lang-id");
          if (_id) {
            const _index = langs.findIndex(
              (_lang) => _lang.id.toString() === _id
            );
            onSetLanguage(
              _index !== -1 ? [...langs][_index] : [...langs].pop()!
            );
          } else {
            onSetLanguage([...langs].pop()!);
          }
        }
      } catch (error) {}
    }
  }

  function getPerms() {
    const permsToken = localStorage.getItem("perms");
    if (permsToken) {
      const perms = jwt.decode(permsToken);
      console.log(perms);
      onSetPerms(perms);
    }
  }

  async function getSv(_language: any) {
    const sV = await getSystemValue(_language.abbreviationName);
    onSetSystemValues(sV);
    const svData = JSON.parse(sV.designSettings)["theme_setting"];
    onSetPath(
      svData[0]["setting"].find((item) => item.key === "image_url").value
    );
  }

  useLayoutEffect(() => {
    getPerms();
    onGetLanguages();
  }, []);

  useEffect(() => {
    if (language) {
      getSv(language);
    }
  }, [language]);

  const { initialState } = useModel("@@initialState");

  if (!initialState || !initialState.settings) {
    return null;
  }

  const { navTheme, layout } = initialState.settings;
  let className = styles.right;

  if ((navTheme === "dark" && layout === "top") || layout === "mix") {
    className = `${styles.right}  ${styles.dark}`;
  }
  return (
    <Space className={className}>
      <LanguageChanger />
      <div>
        {languagesStat === "fulfilled" && (
          <Dropdown
            menu={{ items, onClick: (item) => {
              localStorage.setItem("@lang-id", item.key);
              onSetLanguage(languages[item.key]);
              setLanguageChange(true);
              setTimeout(() => {
                setLanguageChange(false);
              }, 500);
            }
          }}
            placement="bottomRight"
          >
            <div style={{ height: 30 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  height: 30,
                  cursor: "default",
                }}
              >
                {/* <div
                  style={{
                    width: 30,
                    height: 30,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                  }}
                >
                  <img
                    src={language?.flagPath}
                    alt={language?.name}
                    style={{ width: "100%", height: "auto", maxHeight: 30 }}
                  />
                </div> */}
                <div style={{ marginLeft: 5 }}>{language?.name}</div>
                <div style={{ marginTop: 3, marginLeft: 3 }}>
                  <DownOutlined />
                </div>
              </div>
            </div>
          </Dropdown>
        )}
      </div>
      <HeaderSearch
        className={`${styles.action} ${styles.search}`}
        placeholder="Site Search"
        options={[]}
      />
      <Avatar />
      {REACT_APP_ENV && (
        <span>
          <Tag color={ENVTagColor[REACT_APP_ENV]}>{REACT_APP_ENV}</Tag>
        </span>
      )}
      {isLanguageChanging && (
        <div
          style={{
            position: "fixed",
            width: "100px",
            height: "100px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            top: "calc(50% - 75px)",
            left: "calc(50% - 50px)",
            background: "white",
            boxShadow: "0px 0px 2px rgba(0,0,0,0.5)",
            borderRadius: 2,
          }}
        >
          <Spin />
        </div>
      )}
    </Space>
  );
};
export default GlobalHeaderRight;
