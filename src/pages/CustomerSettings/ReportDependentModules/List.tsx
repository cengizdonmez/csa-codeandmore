import CustomPageContainer from "@/components/CustomPageContainer";
import { useDelete, useListAll } from "@/pages/CategoryPages/services";
import { MedicineBoxOutlined } from "@ant-design/icons";
import ProTable, { ProColumns } from "@ant-design/pro-table";
import {
  Button,
  ConfigProvider,
  Divider,
  Modal,
  notification,
  Popconfirm,
  Spin,
} from "antd";
import React, { useLayoutEffect, useRef, useState } from "react";
import { Redirect, useIntl } from "umi";
import usePerms from "../../../hoxmodels/perms";
import EditForm from "./Edit";
import { Module } from "./module";

interface TableItem {
  moduleType: string;
  reportType: string;
}
export type CustomerTypeEditRef = {
  submit: () => void;
};

const List = () => {
  const { perms } = usePerms();
  const [editItem, setEditItem] = useState<string | number | null>(null);

  const [getModules, moduleList, moduleStatus] = useListAll<Module>(
    "/CustomerModule/getall"
  );

  const [deleteModule] = useDelete("/CustomerModule/delete?id=");

  const editRef = useRef<CustomerTypeEditRef>(null);

  if (!perms) {
    return <Spin spinning />;
  }

  const isPermCreate = perms["musteri-modulu.NewRecord"];
  const isPermDelete = perms["musteri-modulu.DeleteRecord"];
  const isPermUpdate = perms["musteri-modulu.UpdateRecord"];
  const isPermList = perms["musteri-modulu.List"];

  if (!isPermList) {
    return <Redirect to="/not-perm" />;
  }

  useLayoutEffect(() => {
    getModules();
  }, []);

  const { formatMessage, locale } = useIntl();

  const columns: ProColumns<Module>[] = [
    {
      title: "Raporlara Ait Modüller",
      dataIndex: "name",
    },
    {
      title: "Ait Olunan Rapor",
      dataIndex: "customerReportName",
    },
    {
      title: isPermDelete && isPermUpdate ? "İşlemler" : " ",
      dataIndex: "option",
      valueType: "option",
      render: (_, record) => (
        <>
          {isPermUpdate && (
            <Button
              style={{ color: "#00A8A2" }}
              onClick={() => {
                setEditItem(record.id);
              }}
            >
              Güncelle
            </Button>
          )}
          {isPermDelete && (
            <>
              <Divider type="vertical" />
              <Popconfirm
                title={"Silmek istediğnize emin misiniz?"}
                onConfirm={async () => {
                  try {
                    const result = await deleteModule(record.id);
                    if (result) await getModules();
                    notification.info({
                      message: "Bilgilendirme",
                      description: "Başarılı",
                    });
                  } catch (error) {
                    notification.error({
                      message: "Hata",
                      description: "Hata meydana geldi!",
                    });
                  }
                }}
                okText="Evet"
                cancelText="Hayır"
              >
                <a>Sil</a>
              </Popconfirm>
            </>
          )}
        </>
      ),
    },
  ];
  return (
    <CustomPageContainer
      icon={<MedicineBoxOutlined />}
      newPath={
        isPermCreate ? "/customer/report-dependent-modules/create" : undefined
      } //yeni ekleme sayfa linki gelecek
    >
      <ConfigProvider locale={{ locale }}>
        <ProTable<Module, { keywords: string }>
          //options={{ density: false }}
          //size="small"
          columns={columns}
          //loading
          dataSource={moduleList}
          loading={moduleStatus === "pending"}
          search={false}
          // onLoad={beforeRender}
          rowKey="id"
          // params={{ keywords }}
          pagination={{
            defaultCurrent: 1,
            showTotal: (total, range) => (
              <>{`${range[0]}-${range[1]} of ${total}`}</>
            ),
          }}
        />
      </ConfigProvider>
      {isPermUpdate && (
        <Modal
          open={!!editItem}
          destroyOnClose
          onOk={() => {
            editRef.current?.submit();
          }}
          onCancel={() => {
            setEditItem(null);
          }}
          width={1000}
          cancelText="İptal"
          okText="Güncelle"
        >
          {!!editItem && (
            <EditForm
              ref={editRef}
              id={editItem}
              onClose={() => {
                setEditItem(null);
                getModules();
              }}
            />
          )}
        </Modal>
      )}
    </CustomPageContainer>
  );
};

export default List;
