import React, { FC } from "react";
import { useIntl, setLocale } from "umi";
import "./lc.css";

const LanguageChanger: FC = () => {
  const { locale } = useIntl();
  const items = [
    {
      id: "en",
      locale: "en-US",
      label: "EN",
      onClick: () => {
        setLocale("en-US");
      },
    },
    {
      id: "tr",
      locale: "tr-TR",
      label: "TR",
      onClick: () => {
        setLocale("tr-TR");
      },
    },
  ];

  return (
    <div className="lc-container">
      <div className="lc-menu">
        {items.map((item: any, index: any) => {
          return (
            <div
              className={`lc-item ${item.locale === locale ? "active" : ""}`}
              key={item.id}
            >
              <span lang={item.id} onClick={item.onClick}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LanguageChanger;
