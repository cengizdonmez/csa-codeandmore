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
import EditForm from "./Edit";
import { Report } from "./report";

interface TableItem {
  reportType: string;
}
export type CustomerTypeEditRef = {
  submit: () => void;
};

const List = () => {
  const { perms } = usePerms();
  const [editItem, setEditItem] = useState<string | number | null>(null);
  const [getReport, reportList, reportStatus] = useListAll<Report>(
    "/CustomerReports/getall"
  );
  const [deleteReport] = useDelete("/CustomerReports/delete?id=");
  const editRef = useRef<CustomerTypeEditRef>(null);

  if (!perms) {
    return <Spin spinning />;
  }

  const isPermCreate = perms["raporlar.NewRecord"];
  const isPermDelete = perms["raporlar.DeleteRecord"];
  const isPermUpdate = perms["raporlar.UpdateRecord"];
  const isPermList = perms["raporlar.List"];

  if (!isPermList) {
    return <Redirect to="/not-perm" />;
  }

  useEffect(() => {
    getReport();
  }, []);

  const { formatMessage, locale } = useIntl();

  const columns: ProColumns<Report>[] = [
    {
      title: "Müşteri Raporları",
      dataIndex: "reportName",
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
                    const result = await deleteReport(record.id);
                    if (result) await getReport();
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
      newPath={isPermCreate ? "/customer/report/create" : undefined} //yeni ekleme sayfa linki gelecek
    >
      <ConfigProvider locale={{ locale }}>
        <ProTable<Report, { keywords: string }>
          //options={{ density: false }}
          columns={columns}
          dataSource={reportList}
          search={false}
          loading={reportStatus === "pending"}
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
              onClose={() => {
                setEditItem(null);
                getReport();
              }}
            />
          )}
        </Modal>
      )}
    </CustomPageContainer>
  );
};

export default List;
