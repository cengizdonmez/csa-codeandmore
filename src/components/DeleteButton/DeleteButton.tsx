import * as React from 'react';
import {Button, Popconfirm} from "antd";
import style from "./DeleteButton.less";

import {DeleteOutlined} from "@ant-design/icons";
import {messages} from "@/constants/appConst";

type Props = {
  onConfirm: any
};

export const DeleteButton = (props: Props) => {
  return (
    <Popconfirm
      title={messages.deleteConfirm}
      onConfirm={props.onConfirm}
      okText="Evet"
      cancelText="Hayır">
      <Button type="primary" danger className={style.SaveButton}><DeleteOutlined/> Sil</Button>
    </Popconfirm>
  );
};


