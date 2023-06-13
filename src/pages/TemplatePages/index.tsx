import React, { ReactElement, useLayoutEffect, useRef, useState } from "react";
import CustomPageContainer from "../../components/CustomPageContainer";
import { trTRIntl } from "@ant-design/pro-provider";
import ProTable, { ProColumns } from "@ant-design/pro-table";
import { useDelete, useListAll } from "../CategoryPages/services";
import {
  Button,
  Divider,
  Modal,
  Popconfirm,
  Spin,
  ConfigProvider,
  Image,
} from "antd";
import { messages } from "@/constants/appConst";
import PageEdit, { PageEditRef } from "./update";
import usePerms from "../../hoxmodels/perms";
import { Redirect, useIntl } from "umi";
import { imageUrl } from "@/utils/http";
import usePath from "../../hoxmodels/path";

interface Props {}

function TemplatePages({}: Props): ReactElement {
  const [getTemps, temps, tempsStatus] = useListAll<any[]>("/Template/getall");
  const [onDelete] = useDelete("/Template/delete?id=");
  const [editItem, setEditItem] = useState<number | string | null>(null);
  const { perms } = usePerms();
  const { path } = usePath();
  const { locale } = useIntl();
  const pageEditRef = useRef<PageEditRef>(null);

  function onGetTemps() {
    getTemps();
  }

  if (!perms) {
    return <Spin spinning />;
  }
  const isPermDelete = perms["template-ayarlari.DeleteRecord"];
  const isPermList = perms["template-ayarlari.List"];
  const isPermCreate = perms["template-ayarlari.NewRecord"];
  const isPermUpdate = perms["template-ayarlari.UpdateRecord"];

  if (!isPermList) {
    return <Redirect to="/not-perm" />;
  }

  const columns: ProColumns<any>[] = [
    {
      title: "Template Adı",
      dataIndex: "name",
    },
    {
      title: "Image",
      dataIndex: "imagePath",
      render: (_, record) => (
        <Image width={100} src={`${path}/${record.imagePath}`} />
      ),
    },
    {
      title: "İşlemler",
      dataIndex: "option",
      valueType: "option",
      render: (_, record) => (
        <>
          {isPermUpdate && (
            <Button
              style={{ color: "#00A8A2" }}
              onClick={() => {
                setEditItem(record.id!);
              }}
            >
              Güncelle
            </Button>
          )}
          {isPermDelete && (
            <>
              <Divider type="vertical" />
              <Popconfirm
                title={messages.deleteConfirm}
                onConfirm={async () => {
                  const success = await onDelete(record.id);
                  if (success) {
                    onGetTemps();
                  }
                  return success;
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

  useLayoutEffect(() => {
    onGetTemps();
  }, []);

  return (
    <CustomPageContainer
      icon={null}
      newPath={isPermCreate && "/template-create"}
    >
      <ConfigProvider locale={{ locale }}>
        <ProTable
          options={{ density: false }}
          size="small"
          search={false}
          columns={columns}
          loading={tempsStatus !== "fulfilled"}
          dataSource={temps}
          onLoad={onGetTemps}
          rowKey="id"
          pagination={{
            defaultCurrent: 1,
            showTotal: (total, range) => (
              <>{`${range[0]}-${range[1]} of ${total}`}</>
            ),
          }}
        />
      </ConfigProvider>
      <Modal
        visible={!!editItem}
        onOk={() => {
          pageEditRef.current?.submit();
        }}
        onCancel={() => {
          setEditItem(null);
        }}
        cancelText="İptal"
        okText="Güncelle"
      >
        {editItem && (
          <PageEdit
            ref={pageEditRef}
            token={editItem}
            onClose={() => {
              setEditItem(null);
              getTemps();
            }}
          />
        )}
      </Modal>
    </CustomPageContainer>
  );
}

export default TemplatePages;
