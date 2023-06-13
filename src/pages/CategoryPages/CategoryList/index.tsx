import React, { ReactElement, useLayoutEffect, useRef, useState } from "react";
import {
  Button,
  Divider,
  Input,
  Modal,
  Popconfirm,
  Form,
  Select,
  Spin,
  Card,
  notification,
  Row,
  Col,
} from "antd";
import ProTable, { ProColumns } from "@ant-design/pro-table";
import ConfigProvider from "antd/es/config-provider";
import {
  CategoryUrl,
  useDelete,
  useListAll,
  useListByLang,
  useClone,
} from "../services";
import { messages } from "@/constants/appConst";
import CustomPageContainer from "../../../components/CustomPageContainer";
import CategoryEdit, { CategoryEditRef } from "../CategoryEdit";
import { AppstoreOutlined } from "@ant-design/icons";
import { Category } from "../data";
import { Redirect, history, useIntl } from "umi";
import useLanguage from "../../../hoxmodels/language";
import { LanguageListItem } from "../../../components/RightContent";
import usePerms from "../../../hoxmodels/perms";
import { sorterTurkish } from "@/helper/sorter";

function CategoryList(): ReactElement {
  const { language } = useLanguage();
  const { locale } = useIntl();
  const [getList, list, status] = useListByLang<Category>(
    CategoryUrl.listByLang
  );
  const [getLanguages, languages, languagesStat] = useListAll<LanguageListItem>(
    "/Language/getall"
  );
  const [
    getWaitingPageList,
    waitingPageList,
    waitingPageStatus,
  ] = useListByLang<Category>(CategoryUrl.getWaitingPage);
  const [onClone, , cloneStat] = useClone(CategoryUrl.clone);
  const [isClone, setClone] = useState<any | null>(null);
  const [editItem, setEditItem] = useState<string | number | null>(null);
  const [deleteCategory] = useDelete(CategoryUrl.deletebyToken);
  const [keywords, setKeywords] = useState("");
  const categoryEditRef = useRef<CategoryEditRef>(null);
  const [cloneForm] = Form.useForm();
  const { perms } = usePerms();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryList, setCategoryList] = useState<Category[] | []>([]);

  async function getCategories() {
    if (language) {
      const datas = await getList(language.abbreviationName);
      setCategoryList(datas);
    }
  }

  async function handleGetWaitingPage() {
    if (language) {
      const datas = await getWaitingPageList(language.abbreviationName);
      setCategoryList(datas);
      notification.open({
        message: "Sayfalar Listelendi.",
        description: "Beklemedeki Sayfalar Listelendi.",
      });
    }
  }

  async function handleGetPublishPage() {
    await getCategories();
    notification.open({
      message: "Sayfalar Listelendi.",
      description: "Yayındaki Sayfalar Listelendi.",
    });
  }

  if (!perms) {
    return <Spin spinning />;
  }

  const isPermCreate = perms["kategoriler.NewRecord"];
  const isPermDelete = perms["kategoriler.DeleteRecord"];
  const isPermUpdate = perms["kategoriler.UpdateRecord"];
  const isPermList = perms["kategoriler.List"];

  if (!isPermList) {
    return <Redirect to="/not-perm" />;
  }

  useLayoutEffect(() => {
    getLanguages();
    getCategories();
  }, [language]);

  const columns: ProColumns<{
    customDefaultUrls: string;
    name: string;
    id: number;
    token: string;
    standByStatus: boolean;
  }>[] = [
    {
      title: "Kategori Adı",
      dataIndex: "name",
    },
    {
      title: "Açıklama",
      dataIndex: "description",
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
                history.push(`/categories/edit/${record.token}`);
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
                  const success = await deleteCategory(record.token);
                  if (success) {
                    getCategories();
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
      icon={<AppstoreOutlined />}
      newPath={isPermCreate ? "/categories/new" : undefined}
    >
      <ConfigProvider locale={{ locale }}>
        <Card>
          <Row
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Col xs={24} md={4}>
              <Input
                placeholder="Ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.currentTarget.value)}
              />
            </Col>
            <Col xs={24} md={4}>
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
          dataSource={
            !!searchQuery
              ? categoryList
                  .filter((item) =>
                    item["name"]
                      ?.toLowerCase()
                      .includes(searchQuery.toLowerCase())
                  )
                  .sort((a, b) => sorterTurkish(a, b, "name")!)
              : categoryList.sort((a, b) => sorterTurkish(a, b, "name")!)
          }
          onLoad={() => {
            getCategories();
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
          destroyOnClose
          onOk={() => {
            categoryEditRef.current?.submit();
          }}
          onCancel={() => {
            setEditItem(null);
          }}
          width={1000}
          cancelText="İptal"
          okText="Güncelle"
        >
          {!!editItem && (
            <CategoryEdit
              ref={categoryEditRef}
              token={editItem}
              onClose={() => {
                setEditItem(null);
                getCategories();
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
