import { useGetOne, useGetWithBody } from "@/pages/CategoryPages/services";
import { Button, Modal } from "antd";
import React, { FC, useEffect, useState } from "react";
import { Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import moment from "moment";

type htmlHistoryType = {
  area: string;
  id: number;
  setData: any;
};

const HtmlHistory: FC<htmlHistoryType> = ({ id, setData, area }) => {
  const [getData, htmlHistoryDatas, htmlHistoryStatus] = useGetOne<any>(
    "/HtmlVersion/getrelationalhistory"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns: ColumnsType<DataType> = [
    {
      title: "Kullanıcı Bilgisi",
      dataIndex: "updateBy",
      key: "updateBy",
    },
    {
      title: "Sıra",
      dataIndex: "orders",
      key: "orders",
    },
    {
      title: "Geçmiş Kayıt İçeriği",
      dataIndex: "historicalData",
      key: "historicalData",
      render: (text) => text.substring(0, 100) + "...",
    },
    {
      title: "Tarih",
      key: "createTime",
      dataIndex: "createTime",
      render: (text) => moment(text).format("DD-MM-YYYY hh:mm:ss")
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button onClick={() => handleVersionClick(record)}>
          Versiyonu Uygula
        </Button>
      ),
    },
  ];

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  function firstLetterLowerCase(obj: any) {
    var key,
      keys = Object.keys(obj);
    var n = keys.length;
    var newobj = {};
    while (n--) {
      key = keys[n];
      newobj[key.charAt(0).toLowerCase() + key.slice(1)] = obj[key];
    }
    return newobj;
  }

  const handleVersionClick = (record: any) => {
    const datas = JSON.parse(record.historicalData);
    let result = firstLetterLowerCase(datas);

    console.log(result, "test");
    setData(result);
    handleOk();
  };

  useEffect(() => {
    getData(`/${area}/${id}`);
  }, []);

  useEffect(() => {
    console.log(htmlHistoryDatas, "htmdatas");
  }, [htmlHistoryDatas]);

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Versiyon
      </Button>
      <Modal
        title="Html History"
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width="70%"
      >
        <Table columns={columns} dataSource={htmlHistoryDatas} />
      </Modal>
    </>
  );
};

export default HtmlHistory;

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}
