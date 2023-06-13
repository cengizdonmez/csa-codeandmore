import React, { ReactElement, useLayoutEffect, useRef, useState } from "react";
import { Redirect, useIntl } from "umi";
import {
  Button,
  Divider,
  Popconfirm,
  Modal,
  Form,
  Spin,
  ConfigProvider,
} from "antd";
import ProTable, { ProColumns } from "@ant-design/pro-table";
import {
  useDelete,
  useListAll,
  useListByLang,
} from "../CategoryPages/services";
import { messages } from "@/constants/appConst";
import { MedicineBoxOutlined } from "@ant-design/icons";
import CustomPageContainer from "../../components/CustomPageContainer";
import useLanguage from "../../hoxmodels/language";
import { LanguageListItem } from "../..//components/RightContent";
import EditForm from "./Edit";
import usePerms from "../../hoxmodels/perms";
import { Customer } from "./customer";

interface Props {}

interface TableItem {
  id?: number;
  name?: string;
  token?: string;
}

function UserList({}: Props): ReactElement {
  const { formatMessage, locale } = useIntl();
  const { language } = useLanguage();
  const [getLanguages, languages, languagesStat] = useListAll<LanguageListItem>(
    "/Language/getall"
  );
  const [getList, list, listStat] = useListByLang("/Customer/getall");
  const [onDelete] = useDelete("/Customer/delete?id=");
  const [keywords, setKeywords] = useState("");
  const [editItem, setEditItem] = useState<string | number | null>(null);
  const [isClone, setClone] = useState<any | null>(null);
  const [cloneForm] = Form.useForm();
  const editRef = useRef(null);
  const { perms } = usePerms();

  if (!perms) {
    return <Spin spinning />;
  }

  const isPermCreate = perms["musteriler.NewRecord"];
  const isPermDelete = perms["musteriler.DeleteRecord"];
  const isPermUpdate = perms["musteriler.UpdateRecord"];
  const isPermList = perms["musteriler.List"];

  if (!isPermList) {
    return <Redirect to="/not-perm" />;
  }

  async function beforeRender() {
    if (language) {
      await getList(language.abbreviationName);
    }
  }

  useLayoutEffect(() => {
    getLanguages();
    beforeRender();
  }, [language]);

  const columns: ProColumns<Customer>[] = [
    {
      title: "Email",
      dataIndex: "email",
      copyable: true,
    },
    {
      title: formatMessage({ id: "userpage.index.firstname" }),
      dataIndex: "firstName",
    },
    {
      title: formatMessage({ id: "userpage.index.lastname" }),
      dataIndex: "lastName",
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
                title={messages.deleteConfirm}
                onConfirm={async () => {
                  const success = await onDelete(record.id);
                  if (success) {
                    beforeRender();
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

  return (
    <CustomPageContainer
      icon={<MedicineBoxOutlined />}
      newPath={isPermCreate ? "/customer-create" : undefined}
    >
      <ConfigProvider locale={{ locale }}>
        <ProTable<TableItem, { keywords: string }>
          options={{ density: false }}
          size="small"
          columns={columns}
          loading={listStat !== "fulfilled"}
          dataSource={list}
          search={false}
          onLoad={beforeRender}
          rowKey="id"
          params={{ keywords }}
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
          visible={!!editItem}
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
                beforeRender();
              }}
            />
          )}
        </Modal>
      )}
    </CustomPageContainer>
  );
}

export default UserList;
