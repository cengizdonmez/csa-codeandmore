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
import React, { useEffect, useRef, useState } from "react";
import { Redirect, useIntl } from "umi";
import usePerms from "../../../hoxmodels/perms";
import { CustomerType } from "./customerType";
import EditForm from "./Edit";

export type CustomerTypeEditRef = {
  submit: () => void;
};

const List = () => {
  const { perms } = usePerms();
  const [
    getCustomerType,
    customerTypeList,
    customerTypeStatus,
  ] = useListAll<CustomerType>("/CustomerType/getall");
  const [deletePlan] = useDelete("/CustomerType/delete?id=");
  const [editItem, setEditItem] = useState<string | number | null>(null);
  const editRef = useRef<CustomerTypeEditRef>(null);

  if (!perms) {
    return <Spin spinning />;
  }
  const isPermCreate = perms["musteri-tipi.NewRecord"];
  const isPermDelete = perms["musteri-tipi.DeleteRecord"];
  const isPermUpdate = perms["musteri-tipi.UpdateRecord"];
  const isPermList = perms["musteri-tipi.List"];

  if (!isPermList) {
    return <Redirect to="/not-perm" />;
  }

  const { formatMessage, locale } = useIntl();

  useEffect(() => {
    getCustomerType();
  }, []);

  const columns: ProColumns<CustomerType>[] = [
    {
      title: "Müşteri Tipi",
      dataIndex: "name",
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
                    const result = await deletePlan(record.id);
                    if (result) {
                      await getCustomerType();
                      notification.info({
                        message: "Bilgilendirme",
                        description: "Başarılı",
                      });
                    }
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
      newPath={isPermCreate ? "/customer/customerType/create" : undefined} //yeni ekleme sayfa linki gelecek
    >
      <ConfigProvider locale={{ locale }}>
        <ProTable<CustomerType, { keywords: string }>
          //options={{ density: false }}
          //size="small"
          columns={columns}
          //loading
          dataSource={customerTypeList}
          search={false}
          loading={customerTypeStatus === "pending"}
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
              token={editItem}
              onClose={async () => {
                setEditItem(null);
                await getCustomerType();
              }}
            />
          )}
        </Modal>
      )}
    </CustomPageContainer>
  );
};

export default List;
