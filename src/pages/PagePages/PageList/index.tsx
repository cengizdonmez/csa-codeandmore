import React, { ReactElement, useLayoutEffect, useState, useRef } from "react";
import {
  Input,
  Button,
  Divider,
  Popconfirm,
  message,
  Modal,
  Form,
  Select,
  Spin,
  Card,
  Row,
  Col,
  notification,
  ConfigProvider,
} from "antd";
import ProTable, { ProColumns } from "@ant-design/pro-table";
import {
  useListAll,
  useDelete,
  useListByLang,
  useClone,
} from "../../CategoryPages/services";
import { WebPageUrl } from "../service";
import { trTRIntl } from "@ant-design/pro-provider";
import { messages } from "@/constants/appConst";
import { CopyOutlined } from "@ant-design/icons";
import CustomPageContainer from "../../../components/CustomPageContainer";
import { WebPage } from "../data";
import PageEdit, { PageEditRef } from "../PageEdit";
import { history, Redirect, useIntl } from "umi";
import useLanguage from "../../../hoxmodels/language";
import { LanguageListItem } from "../../../components/RightContent";
import usePerms from "../../../hoxmodels/perms";

function CategoryList(): ReactElement {
  const { language } = useLanguage();
  const { perms } = usePerms();
  const { locale } = useIntl();

  const [getLanguages, languages, languagesStat] = useListAll<LanguageListItem>(
    "/Language/getall"
  );
  const [getList, list, status] = useListByLang<WebPage>(WebPageUrl.listByLang);
  const [
    getWaitingPageList,
    waitingPageList,
    waitingPageStatus,
  ] = useListByLang<WebPage>(WebPageUrl.getWaitingPage);

  const [editItem, setEditItem] = useState<string | number | null>(null);
  const [onDelete] = useDelete(WebPageUrl.delete);
  const [keywords, setKeywords] = useState("");
  const [onClone, , cloneStat] = useClone(WebPageUrl.clone);
  const [isClone, setClone] = useState<any | null>(null);
  const pageEditRef = useRef<PageEditRef>(null);
  const [cloneForm] = Form.useForm();
  const [searchQuery, setSearchQuery] = useState("");
  const [display_type, setDisplayType] = useState<string | null>(null);
  const [datas, setDatas] = useState<WebPage[] | []>([]);

  async function getDatas() {
    if (language) {
      const datas = await getList(language.abbreviationName);
      setDatas(datas);
    }
  }

  async function handleGetWaitingPage() {
    if (language) {
      const datas = await getWaitingPageList(language.abbreviationName);
      setDatas(datas);
      notification.open({
        message: "Sayfalar Listelendi.",
        description: "Beklemedeki Sayfalar Listelendi.",
      });
    }
  }

  async function handleGetPublishPage() {
    await getDatas();
    notification.open({
      message: "Sayfalar Listelendi.",
      description: "Yayındaki Sayfalar Listelendi.",
    });
  }

  if (!perms) {
    return <Spin spinning />;
  }

  const isPermCreate = perms["sayfa-islemleri.NewRecord"];
  const isPermDelete = perms["sayfa-islemleri.DeleteRecord"];
  const isPermUpdate = perms["sayfa-islemleri.UpdateRecord"];
  const isPermList = perms["sayfa-islemleri.List"];

  if (!isPermList) {
    return <Redirect to="/not-perm" />;
  }

  useLayoutEffect(() => {
    getLanguages();
    getDatas();
  }, [language]);

  const columns: ProColumns<{
    customDefaultUrls: string;
    name: string;
    id: number;
    token: string;
    standByStatus: boolean;
  }>[] = [
    {
      title: "#ID",
      dataIndex: "id",
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: "Sayfa Adı",
      dataIndex: "name",
    },
    {
      title: "Web Adresi",
      dataIndex: "slug",
      copyable: true,
    },
    {
      title: "Durum",
      dataIndex: "standByStatus",
      render: (_, record) => (record.standByStatus ? "Beklemede" : "Yayında"),
    },
    {
      title: isPermDelete && isPermUpdate ? "İşlemler" : " ",
      dataIndex: "option",
      valueType: "option",
      render: (_, record) => (
        <>
          {record.standByStatus && ( 
            <Button
              style={{ marginRight: 5 }}
              onClick={() => {
                 window.open(`${record.customDefaultUrls}`, "_blank");
              }}
            >
              Sayfayı Gör
            </Button>
          )}
          {isPermCreate && (
            <Button
              style={{ marginRight: 5 }}
              onClick={() => {
                setClone(record.token);
              }}
            >
              Klon
            </Button>
          )}

          {isPermUpdate && (
            <Button
              style={{ color: "#00A8A2" }}
              onClick={() => {
                history.push(`/pages/edit/${record.token}`);
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
                  const success = await onDelete(record.token);
                  if (success) {
                    getDatas();
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
      icon={<CopyOutlined />}
      newPath={isPermCreate ? "/pages/new" : undefined}
    >
      <ConfigProvider locale={{locale}}>
        <Card>
          <Row
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Col xs={24} md={12}>
              <Input
                placeholder="Ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.currentTarget.value)}
              />
            </Col>
            <Col>
              <Button onClick={handleGetPublishPage}>Yayındaki Sayfalar</Button>
              <Button
                onClick={handleGetWaitingPage}
                style={{ marginLeft: "5px" }}
              >
                Beklemedeki Sayfalar
              </Button>
            </Col>
          </Row>
        </Card>
        <ProTable<{ name: string; id: number }, { keywords: string }>
          options={{ density: false }}
          size="small"
          search={false}
          columns={columns}
          loading={status !== "fulfilled"}
          dataSource={datas.filter(
            (item) =>
              item.name?.toLowerCase().includes(searchQuery.toLowerCase()) &&
              (!!display_type ? item.Display_type === display_type : true)
          )}
          onLoad={() => {
            getDatas();
          }}
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
          onOk={() => {
            pageEditRef.current?.submit();
          }}
          onCancel={() => {
            setEditItem(null);
          }}
          width={1200}
          cancelText="İptal"
          okText="Güncelle"
        >
          {editItem && (
            <PageEdit
              ref={pageEditRef}
              token={editItem}
              onClose={() => {
                setEditItem(null);
                getDatas();
              }}
            />
          )}
        </Modal>
      )}
      <Modal
        visible={!!isClone}
        cancelText="Kapat"
        onCancel={() => {
          setClone(null);
        }}
        onOk={() => {
          cloneForm.submit();
        }}
        confirmLoading={cloneStat === "pending"}
      >
        <div style={{ marginTop: "2em" }}>
          <Form
            form={cloneForm}
            layout={"vertical"}
            onFinish={async ({ lang }) => {
              await onClone(isClone, lang);
              setClone(null);
            }}
          >
            <Form.Item label="Klonlanacak Dil" name="lang">
              <Select
                allowClear
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                showSearch
              >
                {languages
                  .filter(
                    (lang) =>
                      language?.abbreviationName !== lang.abbreviationName
                  )
                  .map((lang, key) => (
                    <Select.Option value={lang.abbreviationName} key={key}>
                      <img
                        style={{ width: 45, height: 30, marginRight: 15 }}
                        alt={lang.name}
                        src={lang.flagPath}
                      />
                      {lang.name}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </CustomPageContainer>
  );
}

export default CategoryList;
