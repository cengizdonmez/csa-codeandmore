import React from "react";
import { DefaultFooter } from "@ant-design/pro-layout";

export default () => (
  <DefaultFooter
    copyright={`${new Date().getUTCFullYear()} Code And More`}
    links={[
      {
        key: "Code And More",
        title: "Code And More",
        href: "https://www.codeandmore.com.tr/",
        blankTarget: true,
      },
    ]}
  />
);
