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
  Card,
  Spin,
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
  CategoryUrl,
} from "../../CategoryPages/services";
import { PostUrl } from "../services";
import { trTRIntl } from "@ant-design/pro-provider";
import { messages } from "@/constants/appConst";
import PostEdit, { PostEditRef } from "../PostEdit";
import { FileTextOutlined } from "@ant-design/icons";
import CustomPageContainer from "../../../components/CustomPageContainer";
import { Post } from "../data";
import { history, Redirect, useIntl } from "umi";
import useLanguage from "../../../hoxmodels/language";
import { LanguageListItem } from "../../../components/RightContent";
import { Category } from "@/pages/CategoryPages/data";
import usePerms from "../../../hoxmodels/perms";
import { sorterTurkish } from "@/helper/sorter";

function CategoryList(): ReactElement {
  const { language } = useLanguage();
  const { perms } = usePerms();
  const { locale } = useIntl();

  const [getLanguages, languages, languagesStat] = useListAll<LanguageListItem>(
    "/Language/getall"
  );
  const [
    getWaitingPageList,
    waitingPageList,
    waitingPageStatus,
  ] = useListByLang<Post>(PostUrl.getWaitingPage);

  const [onClone, , cloneStat] = useClone(PostUrl.clone);
  const [isClone, setClone] = useState<any | null>(null);
  const [getList, list, status] = useListByLang<Post>(PostUrl.listByLang);
  const [getCats, cats, catStatus] = useListByLang<Category>(
    CategoryUrl.listByLang
  );
  const [onDelete] = useDelete(PostUrl.delete);
  const [keywords, setKeywords] = useState("");
  const postEditRef = useRef<PostEditRef>(null);
  const [editItem, setEditItem] = useState<string | number | null>(null);
  const [cloneForm] = Form.useForm();
  const [selectedCat, setCat] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [datas, setDatas] = useState<Post[] | []>([]);

  async function getDatas() {
    if (language) {
      getCats(language.abbreviationName);
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

  useLayoutEffect(() => {
    getLanguages();
    getDatas();
  }, [language]);

  if (!perms) {
    return <Spin spinning />;
  }

  const isPermCreate = perms["yazilar.NewRecord"];
  const isPermDelete = perms["yazilar.DeleteRecord"];
  const isPermUpdate = perms["yazilar.UpdateRecord"];
  const isPermList = perms["yazilar.List"];

  if (!isPermList) {
    return <Redirect to="/not-perm" />;
  }

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
      title: "Yazı Adı",
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
                history.push(`/text/edit/${record.token}`);
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
      icon={<FileTextOutlined />}
      newPath={isPermCreate ? "/text/new" : undefined}
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
              <Select
                placeholder="Kategoriye Göre Filtrele"
                loading={catStatus === "pending"}
                allowClear
                style={{ maxWidth: 250, minWidth: 250 }}
                onChange={(value) => {
                  setCat(value);
                }}
              >
                {cats &&
                  cats
                    .sort((a, b) => sorterTurkish(a, b, "name"))
                    .map((_cat, index) => (
                      <Select.Option key={index} value={_cat.id}>
                        {_cat.name}
                      </Select.Option>
                    ))}
              </Select>
            </Col>
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
        <ProTable<
          { name: string; id: number; token: string },
          { keywords: string }
        >
          options={{ density: false }}
          size="small"
          columns={columns}
          search={false}
          loading={status !== "fulfilled"}
          dataSource={
            !!selectedCat
              ? !!searchQuery
                ? datas
                    .filter((item) => item.category === selectedCat)
                    .filter((item) =>
                      item["name"]
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase())
                    )
                : datas.filter((item) => item.category === selectedCat)
              : !!searchQuery
              ? datas.filter((item) =>
                  item["name"]
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase())
                )
              : datas
          }
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
          destroyOnClose
          onOk={() => {
            postEditRef.current?.submit();
          }}
          onCancel={() => {
            setEditItem(null);
          }}
          width={1000}
          cancelText="İptal"
          okText="Güncelle"
        >
          {!!editItem && (
            <PostEdit
              ref={postEditRef}
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
