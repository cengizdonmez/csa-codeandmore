import * as React from 'react';
import {Button} from "antd";
import style from "./SaveButton.less";

import {SaveOutlined} from "@ant-design/icons";

export const SaveButton = () => {
  return (
    <Button type="default" className={style.SaveButton} htmlType="submit"><SaveOutlined/> Kaydet</Button>
  );
};
